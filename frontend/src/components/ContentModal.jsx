import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import QuizModal from "./QuizModal";
import { useToast } from "../state/ToastContext.jsx";

export default function ContentModal({ module, onClose }) {
  const toast = useToast();
  const [contents, setContents] = useState([]);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentType, setContentType] = useState("VIDEO");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedContentForQuiz, setSelectedContentForQuiz] = useState(null);

  useEffect(() => {
    fetchContents();
  }, [module.moduleId]);

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `/course-contents/module/${module.moduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContents(response.data.data || response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!confirm("Delete this content?")) return;

    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/course-contents/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContents();
      toast.add("Content deleted successfully");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

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
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 600,
                color: 'white'
              }}
            >
              {module.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                color: 'white'
              }}
            >
              {module.description}
            </p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: 24,
              cursor: 'pointer',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ×
          </button>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h4>Module Contents ({contents.length})</h4>
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
              <button
                className="btn-primary"
                onClick={() => setShowCreateContent(true)}
              >
                + Add {contentType}
              </button>
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
                  onEdit={() => {
                    setEditingContent(content);
                    setContentType(content.contentType === 'Video' ? 'VIDEO' : content.contentType === 'Reading' ? 'READING' : 'QUIZ');
                    setShowCreateContent(true);
                  }}
                  onCreateQuiz={() => {
                    console.log("Opening QuizModal for content:", content);
                    console.log("Content ID:", content.contentId);
                    console.log("Content Type:", content.contentType);
                    setSelectedContentForQuiz(content);
                    setShowQuizModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {showCreateContent && (
          <CreateContentForm
            moduleId={module.moduleId}
            contentType={contentType}
            editingContent={editingContent}
            onClose={() => {
              setShowCreateContent(false);
              setEditingContent(null);
            }}
            onSuccess={() => {
              setShowCreateContent(false);
              setEditingContent(null);
              fetchContents();
              toast.add("Content added successfully");
            }}
          />
        )}

        {showQuizModal && selectedContentForQuiz && (
          <QuizModal
            content={selectedContentForQuiz}
            onClose={() => {
              setShowQuizModal(false);
              setSelectedContentForQuiz(null);
            }}
            onSuccess={() => {
              setShowQuizModal(false);
              setSelectedContentForQuiz(null);
              fetchContents();
              toast.add("Quiz saved successfully");
            }}
          />
        )}
      </div>
    </div>
  );
}

function ContentItem({ content, index, onDelete, onCreateQuiz, onEdit }) {
  const getIcon = () => {
    switch (content.contentType) {
      case "Video":
        return "🎥";
      case "Reading":
        return "📄";
      case "Quiz":
        return "❓";
      default:
        return "📌";
    }
  };

  return (
    <div className="content-item">
      <span className="content-icon">{getIcon()}</span>
      <div className="content-info">
        <h5>{content.title}</h5>
        <span className="content-type">{content.contentType}</span>
        {content.contentUrl && (
          <small className="content-url">{content.contentUrl}</small>
        )}
      </div>
      <div className="content-actions">
        <button className="btn-secondary small" onClick={onEdit} title="Edit Content" style={{marginRight:8}}>
          ✏️ Edit
        </button>
        {(content.contentType === "Quiz" || content.contentType === "QUIZ") && (
          <button
            className="btn-secondary small"
            onClick={onCreateQuiz}
            title="Create/Edit Quiz"
          >
            ✏️ Quiz
          </button>
        )}
        <button className="btn-icon" onClick={onDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
}

function CreateContentForm({ moduleId, contentType, onClose, onSuccess, editingContent }) {
  const [formData, setFormData] = useState({
    title: "",
    type: contentType,
    videoUrl: "",
    readingContent: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState("url"); // 'url' or 'file'
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (editingContent) {
      setFormData({
        title: editingContent.title || "",
        type: editingContent.contentType === 'Video' ? 'VIDEO' : editingContent.contentType === 'Reading' ? 'READING' : 'QUIZ',
        videoUrl: editingContent.contentUrl || "",
        readingContent: editingContent.contentUrl || "",
      });
      // Default uploadType based on whether content currently has a filePath or a URL
      setUploadType(editingContent.filePath ? 'file' : 'url');
      setVideoFile(null);
      setDocumentFile(null);
      setUploadError("");
    } else {
      // reset when creating new
      setFormData({ title: "", type: contentType, videoUrl: "", readingContent: "" });
      setUploadType('url');
      setVideoFile(null);
      setDocumentFile(null);
      setUploadError("");
    }
  }, [editingContent]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/mkv",
        "video/webm",
      ];
      if (!validTypes.includes(file.type)) {
        setUploadError(
          "Please select a valid video file (MP4, AVI, MOV, MKV, WebM)"
        );
        setVideoFile(null);
        return;
      }

      // Validate file size (500MB max)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        setUploadError("File size must be less than 500MB");
        setVideoFile(null);
        return;
      }

      setVideoFile(file);
      setUploadError("");
    }
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type for documents
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!validTypes.includes(file.type)) {
        setUploadError(
          "Please select a valid document file (PDF, DOC, DOCX, TXT)"
        );
        setDocumentFile(null);
        return;
      }

      // Validate file size (50MB max for documents)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        setUploadError("File size must be less than 50MB");
        setDocumentFile(null);
        return;
      }

      setDocumentFile(file);
      setUploadError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError("");

    try {
      const token = localStorage.getItem("token");

      // If we are editing an existing content
      if (editingContent) {
        // Update metadata (title, url/text) or replace file if a new file was selected
        const contentTypeMap = {
          VIDEO: "Video",
          READING: "Reading",
          QUIZ: "Quiz",
        };

        // Prepare payload for PUT
        const payload = {
          moduleId: moduleId,
          title: formData.title,
          contentType: contentTypeMap[formData.type],
          contentUrl: formData.type === "VIDEO" ? formData.videoUrl : formData.type === "READING" ? formData.readingContent : "",
          contentOrder: editingContent.contentOrder || 0,
        };

        // If the user selected a new file while editing, upload it first to get filePath
        if (uploadType === "file" && (videoFile || documentFile)) {
          const formDataUpload = new FormData();
          const file = videoFile || documentFile;
          formDataUpload.append("file", file);
          formDataUpload.append("moduleId", moduleId);
          formDataUpload.append("title", formData.title);
          formDataUpload.append("contentType", payload.contentType);
          formDataUpload.append("contentOrder", payload.contentOrder);

          const uploadResp = await apiClient.post(`/course-contents/upload`, formDataUpload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          const created = uploadResp.data?.data;
          if (!created) throw new Error("Upload failed");

          // Use filePath from temporary created content to update the existing record
          payload.filePath = created.filePath;

          // Update the existing content record with new filePath
          await apiClient.put(`/course-contents/${editingContent.contentId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Clean up the temporary created content record (it only served to store the file)
          try {
            await apiClient.delete(`/course-contents/${created.contentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (cleanupErr) {
            // non-fatal
            console.warn("Failed to delete temporary content record:", cleanupErr);
          }

          onSuccess();
          return;
        }

        // No file replace: update metadata directly
        await apiClient.put(`/course-contents/${editingContent.contentId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        onSuccess();
        return;
      }

      // Handle video file upload
      if (formData.type === "VIDEO" && uploadType === "file") {
        if (!videoFile) {
          setUploadError("Please select a video file");
          setLoading(false);
          return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("file", videoFile);
        formDataUpload.append("moduleId", moduleId);
        formDataUpload.append("title", formData.title);
        formDataUpload.append("contentType", "Video");
        formDataUpload.append("contentOrder", 0);

        await apiClient.post(`/course-contents/upload`, formDataUpload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        onSuccess();
        return;
      }

      // Handle document file upload
      if (formData.type === "READING" && uploadType === "file") {
        if (!documentFile) {
          setUploadError("Please select a document file");
          setLoading(false);
          return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("file", documentFile);
        formDataUpload.append("moduleId", moduleId);
        formDataUpload.append("title", formData.title);
        formDataUpload.append("contentType", "Reading");
        formDataUpload.append("contentOrder", 0);

        await apiClient.post(`/course-contents/upload`, formDataUpload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        onSuccess();
        return;
      }

      // Handle URL-based content
      let contentUrl = "";
      if (formData.type === "VIDEO") {
        contentUrl = formData.videoUrl;
      } else if (formData.type === "READING") {
        contentUrl = formData.readingContent;
      } else if (formData.type === "QUIZ") {
        // For Quiz content, we don't need contentUrl - it will be created via QuizModal
        contentUrl = "";
      }

      // Map frontend types to backend format (Video, Reading, Quiz)
      const contentTypeMap = {
        VIDEO: "Video",
        READING: "Reading",
        QUIZ: "Quiz",
      };

      const payload = {
        moduleId: moduleId,
        title: formData.title,
        contentType: contentTypeMap[formData.type],
        contentUrl: contentUrl,
        contentOrder: 0,
      };

      console.log("Creating content with payload:", payload);
      console.log("Module ID received:", moduleId);
      console.log("Content Type being sent:", payload.contentType);

      const response = await apiClient.post(`/course-contents`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Content created response:", response.data);

      if (response.data.success || response.data.data) {
        console.log(
          "Content created successfully with ID:",
          response.data.data?.contentId || response.data.data?.id
        );
        onSuccess();
      } else {
        setUploadError(response.data.message || "Failed to create content");
      }
    } catch (error) {
      console.error("Content creation error:", error.response?.data);
      setUploadError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760, borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg,#6b46c1,#667eea)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Add {contentType}</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.9)', fontSize: 20, lineHeight: 1, cursor: 'pointer', padding: 6, borderRadius: 6 }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" style={{ padding: 22, background: 'linear-gradient(180deg, #fbfbfd, #f7f7fb)' }}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontSize: 13 }}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`${contentType} title`}
              required
              style={{ width: '100%', padding: '14px 18px', borderRadius: 10, background: '#1f2937', color: '#fff', border: '1px solid rgba(0,0,0,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
            />
          </div>

          {contentType === "VIDEO" && (
            <>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontSize: 13 }}>Upload Method</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType("url");
                      setVideoFile(null);
                      setUploadError("");
                    }}
                    aria-pressed={uploadType === "url"}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(99,102,241,0.08)',
                      background: uploadType === 'url' ? 'linear-gradient(90deg,#6b46c1,#667eea)' : '#f3f4f6',
                      color: uploadType === 'url' ? '#fff' : '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    🔗 Video URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType("file");
                      setFormData((f) => ({ ...f, videoUrl: "" }));
                      setUploadError("");
                    }}
                    aria-pressed={uploadType === "file"}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(99,102,241,0.06)',
                      background: uploadType === 'file' ? 'linear-gradient(90deg,#6b46c1,#667eea)' : '#f3f4f6',
                      color: uploadType === 'file' ? '#fff' : '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    📁 Upload File
                  </button>
                </div>
              </div>

              {uploadType === "url" ? (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontSize: 13 }}>Video URL *</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    required
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 10, background: '#111827', color: '#fff', border: '1px solid rgba(0,0,0,0.12)' }}
                  />
                  <small style={{ color: '#6b7280', display: 'block', marginTop: 6 }}>Supports YouTube, Vimeo, and direct video URLs</small>
                </div>
              ) : (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontSize: 13 }}>Video File *</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label style={{ flex: 1, display: 'block', borderRadius: 10, padding: '12px 14px', background: '#1f2937', color: '#fff', textAlign: 'center', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.06)' }}>
                      📁 Choose file
                      <input
                        type="file"
                        accept="video/mp4,video/avi,video/mov,video/mkv,video/webm"
                        onChange={handleFileChange}
                        required
                        className="file-input"
                        style={{ display: 'none' }}
                      />
                    </label>
                    {videoFile && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ padding: '8px 12px', borderRadius: 10, background: '#111827', color: '#e5e7eb', fontSize: 13 }}>
                          📹 {videoFile.name}
                          <div style={{ color: '#9ca3af', fontSize: 12 }}>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>
                        <button
                          type="button"
                          className="btn-secondary small"
                          onClick={() => {
                            setVideoFile(null);
                            setUploadError("");
                          }}
                          style={{ padding: '8px 10px', borderRadius: 8, background: '#e6e6ea', border: 'none', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <small style={{ color: '#6b7280', display: 'block', marginTop: 8 }}>Supported: MP4, AVI, MOV, MKV, WebM (Max 500MB)</small>
                </div>
              )}
            </>
          )}

          {contentType === "READING" && (
            <>
              {/* Upload Type Selector for Reading */}
              <div className="form-group">
                <label>Content Method</label>
                <div className="upload-type-tabs">
                  <button
                    type="button"
                    className={`upload-tab ${uploadType === "file" ? "active" : ""}`}
                    onClick={() => {
                      setUploadType("file");
                      setFormData((f) => ({ ...f, readingContent: "" }));
                      setUploadError("");
                    }}
                    aria-pressed={uploadType === "file"}
                  >
                    📄 Upload Document
                  </button>
                  <button
                    type="button"
                    className={`upload-tab ${uploadType === "url" ? "active" : ""}`}
                    onClick={() => {
                      setUploadType("url");
                      setDocumentFile(null);
                      setUploadError("");
                    }}
                    aria-pressed={uploadType === "url"}
                  >
                    ✍️ Write Text
                  </button>
                </div>
              </div>

              {uploadType === "url" ? (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontSize: 13 }}>Content *</label>
                  <textarea
                    value={formData.readingContent}
                    onChange={(e) => setFormData({ ...formData, readingContent: e.target.value })}
                    placeholder="Write your reading content here... (Supports Markdown)"
                    rows="12"
                    required
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 10, background: '#0f1724', color: '#fff', border: '1px solid rgba(0,0,0,0.12)' }}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontSize: 13 }}>Document File *</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label style={{ flex: 1, display: 'block', borderRadius: 10, padding: '12px 14px', background: '#1f2937', color: '#fff', textAlign: 'center', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.06)' }}>
                      📄 Choose document
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleDocumentFileChange}
                        required
                        className="file-input"
                        style={{ display: 'none' }}
                      />
                    </label>
                    {documentFile && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ padding: '8px 12px', borderRadius: 10, background: '#111827', color: '#e5e7eb', fontSize: 13 }}>
                          📄 {documentFile.name}
                          <div style={{ color: '#9ca3af', fontSize: 12 }}>{(documentFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>
                        <button
                          type="button"
                          className="btn-secondary small"
                          onClick={() => {
                            setDocumentFile(null);
                            setUploadError("");
                          }}
                          style={{ padding: '8px 10px', borderRadius: 8, background: '#e6e6ea', border: 'none', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <small style={{ color: '#6b7280', display: 'block', marginTop: 8 }}>Supported: PDF, DOC, DOCX, TXT (Max 50MB)</small>
                </div>
              )}
            </>
          )}

          {contentType === "QUIZ" && (
            <div className="form-group">
              <div className="info-banner">
                <p className="title">ℹ️ Quiz Content Created</p>
                <p className="desc">
                  After creating this quiz content, click the "✏️ Quiz" button
                  to add questions and create the actual quiz.
                </p>
              </div>
              <small className="muted-text">
                Note: You only need to provide a title. The quiz questions will
                be added using the Quiz editor.
              </small>
            </div>
          )}

          {uploadError && (
            <div style={{ marginTop: 8, padding: '10px 12px', background: '#fff6f6', color: '#b91c1c', borderRadius: 8, border: '1px solid rgba(185,28,28,0.08)' }}>
              ⚠️ {uploadError}
            </div>
          )}

          <div className="modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 18 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', borderRadius: 10, background: '#e6e6ea', border: 'none', color: '#111827', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg,#6b46c1,#667eea)', color: '#fff' }}>
              {loading
                ? uploadType === "file" && contentType === "VIDEO"
                  ? "Uploading..."
                  : "Adding..."
                : "Add Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
