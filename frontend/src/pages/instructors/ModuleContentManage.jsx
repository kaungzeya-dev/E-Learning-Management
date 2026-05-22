import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import QuizModal from '../../components/QuizModal'
import { useToast } from '../../state/ToastContext.jsx'
import '../styles/InstructorDashboard.css'

export default function ModuleContentManage() {
  const { courseId, moduleId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [module, setModule] = useState(null)
  const [contents, setContents] = useState([])
  const [contentType, setContentType] = useState('VIDEO')
  const [showCreateContent, setShowCreateContent] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showQuizModal, setShowQuizModal] = useState(false)
  const [selectedContentForQuiz, setSelectedContentForQuiz] = useState(null)

  useEffect(() => {
    fetchModuleAndContents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  const fetchModuleAndContents = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const [modRes, contRes] = await Promise.all([
        apiClient.get(`/course-modules/${moduleId}`, { headers: { Authorization: `Bearer ${token}` } }),
        apiClient.get(`/course-contents/module/${moduleId}`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      const modData = modRes.data.data || modRes.data
      setModule(modData)
      setContents(contRes.data.data || contRes.data || [])
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContent = async (contentId) => {
    if (!confirm('Delete this content?')) return
    try {
      const token = localStorage.getItem('token')
      await apiClient.delete(`/course-contents/${contentId}`, { headers: { Authorization: `Bearer ${token}` } })
      await fetchModuleAndContents()
      toast.add('Content deleted successfully')
    } catch (e) {
      alert('Error: ' + (e.response?.data?.message || e.message))
    }
  }

  const handleBack = () => {
    navigate(`/instructor/course/${courseId}`)
  }

  if (loading) {
    return (
      <div className="course-manage-page">
        <div className="course-manage-container">
          <div className="loading-state large">Loading module...</div>
        </div>
      </div>
    )
  }

  if (error || !module) {
    return (
      <div className="course-manage-page">
        <div className="course-manage-container">
          <div className="error-state large">
            <h2>Module Not Available</h2>
            <p>{error || 'We could not find the module you are looking for.'}</p>
            <button className="btn-primary" onClick={handleBack}>Back to Course</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="course-manage-page">
      <div className="course-manage-container">
        <div className="manage-top-bar">
          <button className="btn-secondary" onClick={handleBack}>← Back to Course</button>
          <div className="manage-top-info">
            <h1>{module.title}</h1>
            <p>Manage contents for this module</p>
          </div>
          <span className="status-badge published">Module #{module.moduleId}</span>
        </div>

        <div className="course-manage-card" style={{ minHeight: '650px' }}>
          <div className="course-section">
            <div className="section-header">
              <div>
                <h3>Module Details</h3>
                <p className="section-subtitle">{module.description || 'No module description provided.'}</p>
              </div>
              <Link className="btn-secondary" to={`/instructor/course/${courseId}`}>View Course</Link>
            </div>
          </div>

          <div className="course-section">
            <div className="section-header">
              <h3>Contents ({contents.length})</h3>
              <div className="content-type-selector">
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="content-type-select"
                >
                  <option value="VIDEO">Video</option>
                  <option value="READING">Reading</option>
                  <option value="QUIZ">Quiz</option>
                </select>
                <button className="btn-primary" onClick={() => setShowCreateContent(true)}>+ Add {contentType}</button>
              </div>
            </div>

            {contents.length === 0 ? (
              <div className="empty-state small">
                <p>No content yet. Add videos, readings, or quizzes.</p>
              </div>
            ) : (
              <div className="contents-list">
                {contents.map((content, index) => (
                  <ContentItem
                    key={content.contentId}
                    content={content}
                    index={index}
                    onDelete={() => handleDeleteContent(content.contentId)}
                    onCreateQuiz={() => {
                      setSelectedContentForQuiz(content)
                      setShowQuizModal(true)
                    }}
                    onEdit={() => {
                      setEditingContent(content)
                      setContentType(content.contentType === 'Video' ? 'VIDEO' : content.contentType === 'Reading' ? 'READING' : 'QUIZ')
                      setShowCreateContent(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {showCreateContent && (
            <div
              className="modal-overlay"
              onClick={() => {
                setShowCreateContent(false)
                setEditingContent(null)
              }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)',  
              }}
            >
              <CreateContentForm
                moduleId={Number(moduleId)}
                contentType={contentType}
                editingContent={editingContent}
                onClose={() => { setShowCreateContent(false); setEditingContent(null) }}
                onSuccess={async () => {
                  setShowCreateContent(false)
                  setEditingContent(null)
                  await fetchModuleAndContents()
                  toast.add(editingContent ? 'Content updated successfully' : 'Content added successfully')
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showQuizModal && selectedContentForQuiz && (
        <QuizModal
          content={selectedContentForQuiz}
          onClose={() => {
            setShowQuizModal(false)
            setSelectedContentForQuiz(null)
          }}
          onSuccess={async () => {
            setShowQuizModal(false)
            setSelectedContentForQuiz(null)
            await fetchModuleAndContents()
            toast.add('Quiz saved successfully')
          }}
        />
      )}
    </div>
  )
}

function ContentItem({ content, index, onDelete, onCreateQuiz, onEdit }) {
  const getIcon = () => {
    switch (content.contentType) {
      case 'Video':
      case 'VIDEO':
        return '🎥'
      case 'Reading':
      case 'READING':
        return '📄'
      case 'Quiz':
      case 'QUIZ':
        return '❓'
      default:
        return '📌'
    }
  }

  return (
    <div className="content-item">
      <span className="content-icon">{getIcon()}</span>
      <div className="content-info">
        <h5>{content.title}</h5>
        <span className="content-type">{content.contentType}</span>
        {content.contentUrl && <small className="content-url">{content.contentUrl}</small>}
      </div>
      <div className="content-actions">
        {(content.contentType === 'Quiz' || content.contentType === 'QUIZ') && (
          <button className="btn-secondary small" onClick={onCreateQuiz} title="Create/Edit Quiz">Manage</button>
        )}
        <button className="btn-secondary small" onClick={onEdit} title="Edit Content" style={{ marginLeft: 8 }}>✏️ Edit</button>
        <button className="btn-icon" onClick={onDelete}>🗑️</button>
      </div>
    </div>
  )
}

function CreateContentForm({ moduleId, contentType, onClose, onSuccess, editingContent }) {
  const [formData, setFormData] = useState({
    title: '',
    type: contentType,
    videoUrl: '',
    readingContent: '',
  })
  const [loading, setLoading] = useState(false)
  const [uploadType, setUploadType] = useState('url')
  const [videoFile, setVideoFile] = useState(null)
  const [documentFile, setDocumentFile] = useState(null)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    setFormData((prev) => ({ ...prev, type: contentType }))
    // Default upload method: Video uses URL, Reading uses Document upload
    if (contentType === 'READING') {
      setUploadType('file')
    } else {
      setUploadType('url')
    }
  }, [contentType])

  useEffect(() => {
    if (editingContent) {
      setFormData({
        title: editingContent.title || '',
        type: editingContent.contentType === 'Video' ? 'VIDEO' : editingContent.contentType === 'Reading' ? 'READING' : 'QUIZ',
        videoUrl: editingContent.contentUrl || '',
        readingContent: editingContent.contentUrl || '',
      })
      setUploadType(editingContent.filePath ? 'file' : 'url')
      setVideoFile(null)
      setDocumentFile(null)
      setUploadError('')
    } else {
      setFormData({ title: '', type: contentType, videoUrl: '', readingContent: '' })
      // When creating new content, default Reading to document upload, others to URL
      if (contentType === 'READING') {
        setUploadType('file')
      } else {
        setUploadType('url')
      }
      setVideoFile(null)
      setDocumentFile(null)
      setUploadError('')
    }
  }, [editingContent])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm']
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a valid video file (MP4, AVI, MOV, MKV, WebM)')
        setVideoFile(null)
        return
      }
      const maxSize = 500 * 1024 * 1024
      if (file.size > maxSize) {
        setUploadError('File size must be less than 500MB')
        setVideoFile(null)
        return
      }
      setVideoFile(file)
      setUploadError('')
    }
  }

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ]
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a valid document file (PDF, DOC, DOCX, TXT)')
        setDocumentFile(null)
        return
      }
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        setUploadError('File size must be less than 50MB')
        setDocumentFile(null)
        return
      }
      setDocumentFile(file)
      setUploadError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUploadError('')

    try {
      const token = localStorage.getItem('token')

      // If editing existing content
      if (editingContent) {
        const contentTypeMap = { VIDEO: 'Video', READING: 'Reading', QUIZ: 'Quiz' }
        const payload = {
          moduleId: moduleId,
          title: formData.title,
          contentType: contentTypeMap[formData.type],
          contentUrl: formData.type === 'VIDEO' ? formData.videoUrl : formData.type === 'READING' ? formData.readingContent : '',
          contentOrder: editingContent.contentOrder || 0,
        }

        // If replacing file while editing: upload new file then update
        if (uploadType === 'file' && (videoFile || documentFile)) {
          const formDataUpload = new FormData()
          const file = videoFile || documentFile
          formDataUpload.append('file', file)
          formDataUpload.append('moduleId', moduleId)
          formDataUpload.append('title', formData.title)
          formDataUpload.append('contentType', payload.contentType)
          formDataUpload.append('contentOrder', payload.contentOrder)

          const uploadResp = await apiClient.post(`/course-contents/upload`, formDataUpload, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          })

          const created = uploadResp.data?.data
          if (!created) throw new Error('Upload failed')

          // set filePath to new uploaded file
          payload.filePath = created.filePath

          // update existing content
          await apiClient.put(`/course-contents/${editingContent.contentId}`, payload, { headers: { Authorization: `Bearer ${token}` } })

          // cleanup temporary created record
          try {
            await apiClient.delete(`/course-contents/${created.contentId}`, { headers: { Authorization: `Bearer ${token}` } })
          } catch (cleanupErr) {
            console.warn('Failed to delete temporary content record:', cleanupErr)
          }

          onSuccess()
          return
        }

        // no file replace: update metadata
        await apiClient.put(`/course-contents/${editingContent.contentId}`, payload, { headers: { Authorization: `Bearer ${token}` } })
        onSuccess()
        return
      }

      // Creation flow (unchanged)
      if (formData.type === 'VIDEO' && uploadType === 'file') {
        if (!videoFile) {
          setUploadError('Please select a video file')
          setLoading(false)
          return
        }
        const formDataUpload = new FormData()
        formDataUpload.append('file', videoFile)
        formDataUpload.append('moduleId', moduleId)
        formDataUpload.append('title', formData.title)
        formDataUpload.append('contentType', 'Video')
        formDataUpload.append('contentOrder', 0)
        await apiClient.post(`/course-contents/upload`, formDataUpload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
        onSuccess()
        return
      }

      if (formData.type === 'READING' && uploadType === 'file') {
        if (!documentFile) {
          setUploadError('Please select a document file')
          setLoading(false)
          return
        }
        const formDataUpload = new FormData()
        formDataUpload.append('file', documentFile)
        formDataUpload.append('moduleId', moduleId)
        formDataUpload.append('title', formData.title)
        formDataUpload.append('contentType', 'Reading')
        formDataUpload.append('contentOrder', 0)
        await apiClient.post(`/course-contents/upload`, formDataUpload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
        onSuccess()
        return
      }

      let contentUrl = ''
      if (formData.type === 'VIDEO') contentUrl = formData.videoUrl
      else if (formData.type === 'READING') contentUrl = formData.readingContent

      const contentTypeMap = { VIDEO: 'Video', READING: 'Reading', QUIZ: 'Quiz' }
      const payload = { moduleId: moduleId, title: formData.title, contentType: contentTypeMap[formData.type], contentUrl, contentOrder: 0 }

      const response = await apiClient.post(`/course-contents`, payload, { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success || response.data.data) onSuccess()
      else setUploadError(response.data.message || 'Failed to create content')
    } catch (error) {
      setUploadError(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-content large"
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        width: '90%',
        maxWidth: '760px',
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
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: 'white'
          }}
        >
          {editingContent ? '✏️ Edit Content' : '➕ Add Content'}
        </h3>
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

      <form onSubmit={handleSubmit} className="modal-form" style={{ padding: 24 }}>
        <div className="form-group">
          <label>Title *</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder={`${contentType} title`} required />
        </div>

        {contentType === 'VIDEO' && (
          <>
            <div className="form-group">
              <label>Upload Method</label>
              <div className="upload-type-tabs">
                <button type="button" className={`upload-tab ${uploadType === 'url' ? 'active' : ''}`} onClick={() => { setUploadType('url'); setVideoFile(null); setUploadError('') }}>🔗 Video URL</button>
                <button type="button" className={`upload-tab ${uploadType === 'file' ? 'active' : ''}`} onClick={() => { setUploadType('file'); setFormData((f) => ({ ...f, videoUrl: '' })); setUploadError('') }}>📁 Upload File</button>
              </div>
            </div>

            {uploadType === 'url' ? (
              <div className="form-group">
                <label>Video URL *</label>
                <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." required />
                <small>Supports YouTube, Vimeo, and direct video URLs</small>
              </div>
            ) : (
              <div className="form-group">
                <label>Video File *</label>
                <input type="file" accept="video/mp4,video/avi,video/mov,video/mkv,video/webm" onChange={handleFileChange} className="file-input" />
                {videoFile && (
                  <div className="file-info">
                    <span>📹 {videoFile.name}</span>
                    <span className="file-size">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                )}
                <small>Supported: MP4, AVI, MOV, MKV, WebM (Max 500MB)</small>
              </div>
            )}
          </>
        )}

        {contentType === 'READING' && (
          <>
            <div className="form-group">
              <label>Content Method</label>
              <div className="upload-type-tabs">
                <button
                  type="button"
                  className={`upload-tab ${uploadType === 'file' ? 'active' : ''}`}
                  onClick={() => {
                    setUploadType('file')
                    setFormData((f) => ({ ...f, readingContent: '' }))
                    setUploadError('')
                  }}
                >
                  📄 Upload Document
                </button>
                <button
                  type="button"
                  className={`upload-tab ${uploadType === 'url' ? 'active' : ''}`}
                  onClick={() => {
                    setUploadType('url')
                    setDocumentFile(null)
                    setUploadError('')
                  }}
                >
                  ✍️ Write Text
                </button>
              </div>
            </div>

            {uploadType === 'url' ? (
              <div className="form-group">
                <label>Content *</label>
                <textarea value={formData.readingContent} onChange={(e) => setFormData({ ...formData, readingContent: e.target.value })} placeholder="Write your reading content here... (Supports Markdown)" rows="12" required />
              </div>
            ) : (
              <div className="form-group">
                <label>Document File *</label>
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleDocumentFileChange} className="file-input" />
                {documentFile && (
                  <div className="file-info">
                    <span>📄 {documentFile.name}</span>
                    <span className="file-size">{(documentFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                )}
                <small>Supported: PDF, DOC, DOCX, TXT (Max 50MB)</small>
              </div>
            )}
          </>
        )}

        {contentType === 'QUIZ' && (
          <div className="form-group">
            <div className="info-banner">
              <p className="title">ℹ️ Quiz Content Created</p>
              <p className="desc">After creating this quiz content, click the "✏️ Quiz" button to add questions and create the actual quiz.</p>
            </div>
            <small className="muted-text">Note: You only need to provide a title. The quiz questions will be added using the Quiz editor.</small>
          </div>
        )}

        {uploadError && <div className="error-message">⚠️ {uploadError}</div>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? (uploadType === 'file' && contentType === 'VIDEO' ? 'Uploading...' : 'Saving...') : (editingContent ? 'Save Changes' : 'Add Content')}</button>
        </div>
      </form>
    </div>
  )
}