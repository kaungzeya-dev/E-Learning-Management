import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import { categoryAPI } from '../services/api.js'

export default function CourseModal({ course, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    categoryId: course?.categoryId || null,
    instructorId: course?.instructorId || null,
    status: course?.status || 'Draft',
    thumbnail: course?.thumbnail || '',
    level: course?.level || 'Beginner',
    duration: course?.duration || '6 weeks'
  })
  const [imagePreview, setImagePreview] = useState(course?.thumbnail || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setError('')
        
        const categoriesData = await categoryAPI.getAllCategories()
        console.log('Categories data:', categoriesData)
        
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData)
          
          // If editing a course and it has a categoryId, keep it
          // Otherwise, set the first category as default
          if (!formData.categoryId && categoriesData.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: categoriesData[0].categoryId
            }))
          }
        } else {
          console.warn('No categories returned from API')
          setError('No categories available. Please add categories first.')
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories. The server might be down or the categories API is not implemented.')
      } finally {
        setLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [formData.categoryId])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.onerror = () => {
        setImageError('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      
      // Use instructorId from the stored user data
      const payload = {
        ...formData,
        instructorId: userData.instructorId
      }

      if (course) {
        await apiClient.put(`/courses/${course.courseId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await apiClient.post('/courses', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course')
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
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <div 
          className="modal-header"
          style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <h2 
            style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: 0,
              color: 'white'
            }}
          >
            {course ? '✏️ Edit Course' : ' Create New Course'}
          </h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '28px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              hover: { background: 'rgba(255,255,255,0.3)' }
            }}
          >
            ×
          </button>
        </div>
        
        {error && (
          <div 
            className="error-message"
            style={{
              margin: '16px 24px',
              padding: '12px 16px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              fontSize: '14px'
            }}
          >
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Course Title */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label 
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}
            >
              Course Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Introduction to Web Development"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label 
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}
            >
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what students will learn..."
              rows="4"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Course Thumbnail */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label 
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}
            >
              Course Thumbnail Image <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div 
              className="file-input-container"
              style={{
                position: 'relative',
                marginBottom: '12px'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                id="course-thumbnail"
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="course-thumbnail"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 18px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginRight: '12px',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
              >
                📷 Choose Image
              </label>
              <span 
                style={{
                  fontSize: '13px',
                  color: formData.thumbnail ? '#10b981' : '#6b7280',
                  marginRight: '12px'
                }}
              >
                {formData.thumbnail ? '✓ Image selected' : 'No image selected'}
              </span>
              {formData.thumbnail && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({...formData, thumbnail: ''});
                    setImagePreview('');
                    setImageError('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                >
                  🗑️ Remove
                </button>
              )}
            </div>
            
            {imageError && (
              <div 
                style={{
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '6px',
                  borderLeft: '3px solid #dc2626'
                }}
              >
                ⚠️ {imageError}
              </div>
            )}
            
            {imagePreview && (
              <div 
                className="image-preview"
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  marginBottom: '12px'
                }}
              >
                <img 
                  src={imagePreview} 
                  alt="Course thumbnail preview" 
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '6px'
                  }}
                />
              </div>
            )}
            <small 
              style={{
                fontSize: '12px',
                color: '#6b7280',
                display: 'block'
              }}
            >
              📏 Recommended: 16:9 ratio, max 2MB
            </small>
          </div>

          {/* Level and Duration */}
          <div 
            className="form-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <div className="form-group">
              <label 
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}
              >
                Level <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="Beginner">🟢 Beginner</option>
                <option value="Intermediate">🟡 Intermediate</option>
                <option value="Advanced">🔴 Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label 
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}
              >
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 6 weeks"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1f2937',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
              <small 
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  display: 'block',
                  marginTop: '4px'
                }}
              >
                e.g., "6 weeks", "3 months"
              </small>
            </div>
          </div>

          {/* Category and Status */}
          <div 
            className="form-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            <div className="form-group">
              <label 
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}
              >
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {loadingCategories ? (
                <div 
                  style={{
                    padding: '12px',
                    color: '#6b7280',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}
                >
                  ⏳ Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div 
                  style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  ⚠️ No categories available
                </div>
              ) : (
                <>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value) || null})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      color: '#1f2937',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <small 
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    Select the best fitting category
                  </small>
                </>
              )}
            </div>

            <div className="form-group">
              <label 
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}
              >
                Status <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="Draft">📝 Draft</option>
                <option value="Published">✅ Published</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className="modal-actions"
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}
          >
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '10px 24px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? '⏳ Saving...' : course ? '💾 Update Course' : '✨ Create Course'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
