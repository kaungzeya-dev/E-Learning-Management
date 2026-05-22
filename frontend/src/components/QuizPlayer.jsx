import { useState, useEffect } from 'react'
import { quizAPI } from '../services/api.js'

export default function QuizPlayer({ content, studentId }) {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuiz()
  }, [content?.contentId])

  const fetchQuiz = async () => {
    if (!content?.contentId) {
      setError('Content ID is missing')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    
    console.log('=== QUIZ PLAYER: FETCHING QUIZ ===')
    console.log('Content ID:', content.contentId)
    console.log('Content Type:', content.contentType)
    
    try {
      // First try to get quiz by content ID
      const quizData = await quizAPI.getQuizByContentId(content.contentId)
      console.log('Quiz data received in QuizPlayer:', quizData)
      
      if (quizData) {
        setQuiz(quizData)
        // Initialize answers object
        const initialAnswers = {}
        quizData.questions?.forEach(q => {
          initialAnswers[q.questionId] = ''
        })
        setAnswers(initialAnswers)
        console.log('Quiz loaded successfully with', quizData.questions?.length || 0, 'questions')
      } else {
        console.log('No quiz data returned')
        setError('Quiz not available yet. The instructor may not have created the quiz questions yet.')
      }
    } catch (err) {
      console.error('Error fetching quiz:', err)
      console.error('Error details:', err.message, err.stack)
      setError(`Failed to load quiz: ${err.message}. Please check the console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    })
  }

  const handleSubmit = async () => {
    if (!quiz || !studentId) return

    // Check if all questions are answered
    const unanswered = quiz.questions?.filter(q => !answers[q.questionId] || answers[q.questionId] === '')
    if (unanswered && unanswered.length > 0) {
      if (!confirm(`You have ${unanswered.length} unanswered question(s). Do you want to submit anyway?`)) {
        return
      }
    }

    setSubmitting(true)
    setError('')

    try {
      // Convert answers to the format expected by API (questionId -> answer)
      const answerMap = {}
      Object.keys(answers).forEach(questionId => {
        if (answers[questionId]) {
          answerMap[questionId] = answers[questionId]
        }
      })

      const resultData = await quizAPI.submitQuizAttempt(quiz.quizId, studentId, answerMap)
      setResult(resultData)
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting quiz:', err)
      setError(err.response?.data?.message || 'Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading quiz...</span>
        </div>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading quiz...</p>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
        <h5 style={{ color: '#dc2626', marginBottom: '8px' }}>Quiz Not Available</h5>
        <p style={{ color: '#6b7280' }}>{error}</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
        <h5 style={{ color: '#6b7280', marginBottom: '8px' }}>No Quiz Available</h5>
        <p style={{ color: '#6b7280' }}>This quiz hasn't been created yet.</p>
      </div>
    )
  }

  if (submitted && result) {
    const percentage = ((result.score / result.maxScore) * 100).toFixed(1)
    const isPassing = percentage >= 70

    return (
      <div style={{ padding: '32px' }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '32px', 
          background: isPassing ? '#d1fae5' : '#fee2e2',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {isPassing ? '🎉' : '📝'}
          </div>
          <h3 style={{ color: isPassing ? '#065f46' : '#991b1b', marginBottom: '8px' }}>
            {isPassing ? 'Great Job!' : 'Keep Learning!'}
          </h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: isPassing ? '#065f46' : '#991b1b', marginBottom: '8px' }}>
            {result.score} / {result.maxScore}
          </div>
          <div style={{ fontSize: '18px', color: isPassing ? '#065f46' : '#991b1b' }}>
            {percentage}% Correct
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h5 style={{ marginBottom: '16px', color: '#2d3748' }}>Quiz Review</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quiz.questions?.map((question, index) => {
              const userAnswer = answers[question.questionId]
              const isCorrect = result.answerResults?.[question.questionId]?.isCorrect
              
              return (
                <div 
                  key={question.questionId} 
                  style={{
                    padding: '20px',
                    background: isCorrect ? '#d1fae5' : '#fee2e2',
                    border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ 
                      fontSize: '20px',
                      fontWeight: '700',
                      color: isCorrect ? '#10b981' : '#ef4444'
                    }}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <h6 style={{ margin: 0, color: '#2d3748' }}>
                      Question {index + 1}: {question.questionText}
                    </h6>
                  </div>
                  
                  <div style={{ marginTop: '12px' }}>
                    {question.options?.map((option, optIndex) => {
                      const optionLetter = String.fromCharCode(65 + optIndex) // A, B, C, D
                      const isSelected = userAnswer === String(optIndex) || userAnswer === optionLetter
                      
                      return (
                        <div 
                          key={optIndex}
                          style={{
                            padding: '10px 12px',
                            marginBottom: '8px',
                            background: isSelected ? (isCorrect ? '#a7f3d0' : '#fecaca') : '#f9fafb',
                            border: `1px solid ${isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#e5e7eb'}`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span style={{ 
                            fontWeight: '600',
                            color: isSelected ? (isCorrect ? '#065f46' : '#991b1b') : '#6b7280'
                          }}>
                            {optionLetter}.
                          </span>
                          <span style={{ 
                            color: isSelected ? (isCorrect ? '#065f46' : '#991b1b') : '#374151'
                          }}>
                            {option}
                          </span>
                          {isSelected && (
                            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: '600' }}>
                              Your Answer
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSubmitted(false)
              setResult(null)
              setAnswers({})
              fetchQuiz()
            }}
            style={{ borderRadius: '10px', padding: '10px 24px' }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#2d3748', marginBottom: '8px' }}>{quiz.title}</h4>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Total Questions: {quiz.questions?.length || 0} | Max Score: {quiz.maxScore}
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {quiz.questions?.map((question, index) => (
          <div 
            key={question.questionId}
            style={{
              padding: '24px',
              background: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <h5 style={{ color: '#2d3748', marginBottom: '16px' }}>
              Question {index + 1}: {question.questionText}
            </h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {question.options?.map((option, optIndex) => {
                const optionLetter = String.fromCharCode(65 + optIndex) // A, B, C, D
                const optionValue = String(optIndex)
                const isSelected = answers[question.questionId] === optionValue || 
                                  answers[question.questionId] === optionLetter

                return (
                  <label
                    key={optIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: isSelected ? '#eff6ff' : '#f9fafb',
                      border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: isSelected ? '600' : '400'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f3f4f6'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f9fafb'
                        e.currentTarget.style.borderColor = '#e5e7eb'
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      value={optionValue}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(question.questionId, optionValue)}
                      style={{
                        marginRight: '12px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#3b82f6'
                      }}
                    />
                    <span style={{ 
                      marginRight: '8px',
                      fontWeight: '600',
                      color: isSelected ? '#3b82f6' : '#6b7280',
                      minWidth: '24px'
                    }}>
                      {optionLetter}.
                    </span>
                    <span style={{ 
                      color: isSelected ? '#1e40af' : '#374151',
                      flex: 1
                    }}>
                      {option}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '32px', 
        padding: '20px',
        background: '#f9fafb',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: '#6b7280' }}>
          {Object.values(answers).filter(a => a).length} of {quiz.questions?.length || 0} questions answered
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ 
            borderRadius: '10px', 
            padding: '10px 32px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  )
}

