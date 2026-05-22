import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

export default function QuizModal({ content, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    maxScore: 100.0,
    questions: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingQuiz, setExistingQuiz] = useState(null)

  useEffect(() => {
    if (content?.contentId) {
      // Check if quiz already exists for this content
      checkExistingQuiz()
    }
  }, [content?.contentId])

  const checkExistingQuiz = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiClient.get(
        `/quizzes/content/${content.contentId}?includeCorrectAnswers=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success && response.data.data) {
        setExistingQuiz(response.data.data)
        setFormData({
          title: response.data.data.title || content.title,
          maxScore: response.data.data.maxScore || 100.0,
          questions: response.data.data.questions?.map(q => ({
            questionText: q.questionText,
            options: q.options || [],
            correctAnswer: q.correctAnswer
          })) || []
        })
      }
    } catch (error) {
      // Quiz doesn't exist yet, which is fine
      console.log('No existing quiz found for contentId:', content.contentId)
      console.log('Error:', error.response?.data || error.message)
    }
  }

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: '0'
        }
      ]
    })
  }

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    })
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions]
    const updatedOptions = [...updatedQuestions[questionIndex].options]
    updatedOptions[optionIndex] = value
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: [...updatedQuestions[questionIndex].options, '']
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions]
    const currentQuestion = updatedQuestions[questionIndex]
    const currentCorrectAnswer = parseInt(currentQuestion.correctAnswer)
    
    // Filter out the removed option
    const filteredOptions = currentQuestion.options.filter((_, i) => i !== optionIndex)
    
    // Adjust correctAnswer index if needed
    let newCorrectAnswer = currentQuestion.correctAnswer
    if (!isNaN(currentCorrectAnswer)) {
      if (currentCorrectAnswer === optionIndex) {
        // If we removed the correct answer, set to first option (0)
        newCorrectAnswer = filteredOptions.length > 0 ? '0' : ''
      } else if (currentCorrectAnswer > optionIndex) {
        // If correct answer was after the removed option, decrement the index
        newCorrectAnswer = String(currentCorrectAnswer - 1)
      }
      // If correct answer was before the removed option, keep it the same
    }
    
    updatedQuestions[questionIndex] = {
      ...currentQuestion,
      options: filteredOptions,
      correctAnswer: newCorrectAnswer
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Quiz title is required')
      return false
    }

    if (formData.questions.length === 0) {
      setError('At least one question is required')
      return false
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i]
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1}: Question text is required`)
        return false
      }

      const validOptions = question.options.filter(opt => opt.trim())
      if (validOptions.length < 2) {
        setError(`Question ${i + 1}: At least 2 options are required`)
        return false
      }

      if (!question.correctAnswer || question.correctAnswer === '') {
        setError(`Question ${i + 1}: Please select a correct answer`)
        return false
      }

      const correctIndex = parseInt(question.correctAnswer)
      if (isNaN(correctIndex)) {
        setError(`Question ${i + 1}: Invalid correct answer format`)
        return false
      }
      
      // Check if the index is within bounds
      if (correctIndex < 0 || correctIndex >= question.options.length) {
        setError(`Question ${i + 1}: Invalid correct answer index`)
        return false
      }
      
      // Check if the selected option is not empty
      if (!question.options[correctIndex] || !question.options[correctIndex].trim()) {
        setError(`Question ${i + 1}: The selected correct answer option is empty. Please select a different option.`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      // Prepare questions with only non-empty options
      // IMPORTANT: Map correctAnswer index to match filtered options
      const preparedQuestions = formData.questions.map(q => {
        const originalOptions = q.options
        const validOptions = originalOptions.filter(opt => opt.trim())
        
        // Find the original correct answer option
        const originalCorrectIndex = parseInt(q.correctAnswer)
        let mappedCorrectAnswer = q.correctAnswer
        
        if (!isNaN(originalCorrectIndex) && originalCorrectIndex >= 0 && originalCorrectIndex < originalOptions.length) {
          // Get the text of the correct answer option
          const correctOptionText = originalOptions[originalCorrectIndex]?.trim()
          
          if (correctOptionText) {
            // Find the index of this option in the filtered array
            const newIndex = validOptions.findIndex(opt => opt.trim() === correctOptionText)
            if (newIndex >= 0) {
              mappedCorrectAnswer = String(newIndex)
            } else {
              // If we can't find it (shouldn't happen), default to 0
              console.warn(`Could not find correct answer option in filtered array, defaulting to 0`)
              mappedCorrectAnswer = validOptions.length > 0 ? '0' : ''
            }
          } else {
            // Correct answer points to empty option, default to 0
            mappedCorrectAnswer = validOptions.length > 0 ? '0' : ''
          }
        } else {
          // Invalid index, default to 0
          mappedCorrectAnswer = validOptions.length > 0 ? '0' : ''
        }
        
        const prepared = {
          questionText: q.questionText.trim(),
          options: validOptions,
          correctAnswer: mappedCorrectAnswer
        }
        
        console.log(`Question "${prepared.questionText.substring(0, 30)}...":`)
        console.log(`  - Original correct answer index: ${q.correctAnswer}`)
        console.log(`  - Mapped correct answer index: ${mappedCorrectAnswer}`)
        console.log(`  - Correct answer text: "${validOptions[parseInt(mappedCorrectAnswer)] || 'N/A'}"`)
        console.log(`  - Total valid options: ${validOptions.length}`)
        
        return prepared
      })
      
      console.log('=== PREPARED QUESTIONS FOR SUBMISSION ===')
      preparedQuestions.forEach((q, idx) => {
        console.log(`Question ${idx + 1}:`, {
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          correctAnswerText: q.options[parseInt(q.correctAnswer)]
        })
      })

      // Validate contentId exists
      if (!content?.contentId) {
        setError('Content ID is missing. Please make sure the quiz content item exists.')
        setLoading(false)
        return
      }

      // Validate we have at least one question
      if (preparedQuestions.length === 0) {
        setError('Please add at least one question to the quiz.')
        setLoading(false)
        return
      }

      const payload = {
        contentId: content.contentId,
        title: formData.title.trim(),
        maxScore: parseFloat(formData.maxScore),
        questions: preparedQuestions
      }

      console.log('=== QUIZ CREATION DEBUG ===')
      console.log('Content ID:', content.contentId)
      console.log('Content Type:', content.contentType)
      console.log('Payload:', JSON.stringify(payload, null, 2))

      let response
      if (existingQuiz) {
        // Update existing quiz
        console.log('Updating existing quiz ID:', existingQuiz.quizId)
        response = await apiClient.put(`/quizzes/${existingQuiz.quizId}`, payload, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('Quiz updated response:', response.data)
      } else {
        // Create new quiz
        console.log('Creating new quiz...')
        response = await apiClient.post('/quizzes', payload, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('Quiz created response:', response.data)
        console.log('Response status:', response.status)
      }

      if (response.data.success) {
        // Show success message briefly before closing
        alert(existingQuiz ? 'Quiz updated successfully!' : 'Quiz created successfully!')
        onSuccess()
      } else {
        setError(response.data.message || 'Failed to save quiz')
      }
    } catch (err) {
      console.error('Quiz save error:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || err.message || 'Failed to save quiz. Please check the console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="modal-content large"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <div
          className="modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: 'white'
            }}
          >
            {existingQuiz ? '✏️ Edit Quiz' : '➕ Create Quiz'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: 24,
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form" style={{ padding: 24 }}>
          <div className="form-group">
            <label>Quiz Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., HTML Basics Quiz"
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Score *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.maxScore}
              onChange={(e) => setFormData({...formData, maxScore: parseFloat(e.target.value) || 0})}
              required
            />
            <small>Default: 100.0</small>
          </div>

          <div className="questions-section">
            <div className="section-header">
              <h3>Questions ({formData.questions.length})</h3>
              <button type="button" className="btn-secondary" onClick={addQuestion}>
                + Add Question
              </button>
            </div>

            {formData.questions.length === 0 ? (
              <div className="empty-state small">
                <p>No questions yet. Click "Add Question" to get started.</p>
              </div>
            ) : (
              <div className="questions-list">
                {formData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="question-card">
                    <div className="question-header">
                      <h4>Question {qIndex + 1}</h4>
                      <button
                        type="button"
                        className="btn-icon danger"
                        onClick={() => removeQuestion(qIndex)}
                        disabled={formData.questions.length === 1}
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Question Text *</label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        placeholder="Enter your question here..."
                        rows="2"
                        required
                      />
                    </div>

                    <div className="options-section">
                      <div className="options-header">
                        <label>Answer Options *</label>
                        <button
                          type="button"
                          className="btn-secondary small"
                          onClick={() => addOption(qIndex)}
                        >
                          + Add Option
                        </button>
                      </div>

                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-row">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === String(oIndex)}
                            onChange={() => updateQuestion(qIndex, 'correctAnswer', String(oIndex))}
                            disabled={!option.trim()}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="option-input"
                          />
                          <button
                            type="button"
                            className="btn-icon small"
                            onClick={() => removeOption(qIndex, oIndex)}
                            disabled={question.options.filter(opt => opt.trim()).length <= 2}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {question.options.filter(opt => opt.trim()).length < 2 && (
                        <small className="warning-text">
                          At least 2 options are required
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : existingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

