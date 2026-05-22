import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  courseAPI,
  courseModuleAPI,
  courseContentAPI,
  progressAPI,
} from "../../services/api.js";
import QuizPlayer from "../../components/QuizPlayer.jsx";
import { useToast } from "../../state/ToastContext.jsx";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContentId, setActiveContentId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [completedContents, setCompletedContents] = useState([]);
  const [courseProgress, setCourseProgress] = useState({
    progressPercentage: 0,
    completedModules: 0,
    totalModules: 0,
  });
  const toast = useToast();

  // Fetch student progress from backend
  const fetchStudentProgress = async (studentId) => {
    try {
      console.log(`Fetching progress for student ${studentId} in course ${id}`);

      // Use the progressAPI service to fetch student progress
      const progressData = await progressAPI.getStudentProgress(id, studentId);

      // Update course progress state
      setCourseProgress({
        progressPercentage: progressData.progressPercentage || 0,
        completedModules: progressData.completedModules || 0,
        totalModules: progressData.totalModules || 0,
      });

      // Update completed contents based on backend data
      const completedContentIds = [];
      if (progressData.moduleProgress) {
        progressData.moduleProgress.forEach((module) => {
          if (module.completedContentIds) {
            console.log(
              `Module ${module.moduleId} completed contents:`,
              module.completedContentIds
            );
            completedContentIds.push(...module.completedContentIds);
          }
        });

        if (completedContentIds.length > 0) {
          console.log("Setting completed contents:", completedContentIds);
          setCompletedContents(completedContentIds);
        }
      }
    } catch (error) {
      console.error("Error fetching student progress:", error);
      // If there's an error fetching progress, we'll still initialize with the modules from fetchCourseData
      console.log(
        "Error fetching progress, will initialize after course data is loaded"
      );
    }
  };

  // Function to fetch course data
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      // Fetch course details
      console.log("Fetching course details for ID:", id);
      const courseData = await courseAPI.getCourseById(id);
      console.log("Course data received:", courseData);
      setCourse(courseData);

      // Fetch course modules
      console.log("Fetching modules for course ID:", id);
      const modulesData = await courseModuleAPI.getModulesByCourseId(id);
      console.log("Modules data received:", modulesData);
      setModules(modulesData);

      // Initialize course progress with total modules
      // This ensures we show the correct total even if no progress has been made yet
      setCourseProgress((prev) => ({
        ...prev,
        totalModules: modulesData.length,
      }));

      // Fetch all contents for all modules
      const allContents = [];
      for (const module of modulesData) {
        console.log("Fetching contents for module ID:", module.moduleId);
        try {
          const moduleContents = await courseContentAPI.getContentsByModuleId(
            module.moduleId
          );
          console.log(
            "Contents for module",
            module.moduleId,
            ":",
            moduleContents
          );
          allContents.push(
            ...moduleContents.map((c) => ({
              ...c,
              moduleName: module.title,
              moduleId: module.moduleId, // Ensure moduleId is included for each content
            }))
          );
        } catch (moduleError) {
          console.error(
            "Error fetching contents for module",
            module.moduleId,
            ":",
            moduleError
          );
        }
      }
      console.log("All course contents:", allContents);
      setContents(allContents);

      // Set first content as active
      if (allContents.length > 0) {
        setActiveContentId(allContents[0].contentId);
        console.log("Active content set to:", allContents[0]);
      } else {
        console.warn("No content found for this course");
      }

      // If we have a studentId, fetch the latest progress data
      if (studentId) {
        try {
          console.log("Fetching latest progress data for student:", studentId);
          const progressData = await progressAPI.getStudentProgress(
            id,
            studentId
          );
          console.log("Latest progress data:", progressData);

          // Update progress state with the latest data
          setCourseProgress({
            progressPercentage: progressData.progressPercentage || 0,
            completedModules: progressData.completedModules || 0,
            totalModules: progressData.totalModules || modulesData.length,
          });

          // Update completed contents
          if (progressData.moduleProgress) {
            const completedContentIds = [];
            progressData.moduleProgress.forEach((module) => {
              if (module.completedContentIds) {
                completedContentIds.push(...module.completedContentIds);
              }
            });

            if (completedContentIds.length > 0) {
              console.log(
                "Setting completed contents from API:",
                completedContentIds
              );
              setCompletedContents(completedContentIds);
            }
          }
        } catch (progressError) {
          console.error("Error fetching latest progress:", progressError);
        }
      }
    } catch (error) {
      console.error("Failed to fetch course data:", error);
      toast.add("Failed to load course data. Please try again later.", {
        type: "error",
        title: "Course Player",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Get student ID from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.studentId) {
          setStudentId(user.studentId);

          // Load completed contents from localStorage as backup
          const savedProgress = localStorage.getItem(
            `course_progress_${id}_${user.studentId}`
          );
          if (savedProgress) {
            try {
              const parsedProgress = JSON.parse(savedProgress);
              setCompletedContents(parsedProgress.completedContents || []);
            } catch (e) {
              console.error("Error parsing saved progress:", e);
            }
          }

          // Fetch course data after setting studentId
          await fetchCourseData();

          // Load progress from backend after course data is loaded
          await fetchStudentProgress(user.studentId);
        } else {
          // No student ID, just fetch course data
          await fetchCourseData();
        }
      } else {
        // No user data, just fetch course data
        await fetchCourseData();
      }
    };

    loadData();
  }, [id]);

  const activeContent = contents.find((c) => c.contentId === activeContentId);
  const activeIndex = contents.findIndex(
    (c) => c.contentId === activeContentId
  );
  const isLast = activeIndex >= contents.length - 1 && contents.length > 0;
  const allCompleted =
    (contents.length > 0 &&
      contents.every((c) => completedContents.includes(c.contentId))) ||
    courseProgress?.progressPercentage >= 100;

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "10vh auto", textAlign: "center" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading course...</p>
      </div>
    );
  }
  if (!course) {
    return (
      <div style={{ maxWidth: 900, margin: "10vh auto", textAlign: "left" }}>
        <h2>Course not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const goPrev = () => {
    if (activeIndex > 0)
      setActiveContentId(contents[activeIndex - 1].contentId);
  };

  const goNext = () => {
    if (activeIndex < contents.length - 1) {
      setActiveContentId(contents[activeIndex + 1].contentId);
      return;
    }
    // If at last content and all contents are completed, go to My Courses
    const contentIds = contents.map((c) => c.contentId);
    const completedSet = new Set(completedContents);
    const allCompleted =
      (contentIds.length > 0 &&
        contentIds.every((id) => completedSet.has(id))) ||
      courseProgress?.progressPercentage >= 100;
    if (allCompleted) {
      navigate("/my-courses");
    }
  };

  const markAsCompleted = async (contentId) => {
    if (!studentId || !contentId) return;

    // Add contentId to completed contents if not already there
    if (!completedContents.includes(contentId)) {
      try {
        // Get the active content to get moduleId
        const activeContent = contents.find((c) => c.contentId === contentId);
        if (!activeContent) {
          console.error("Could not find active content with ID:", contentId);
          toast.add(
            "We couldn't find that content block. Please refresh and try again.",
            {
              type: "error",
              title: "Mark as Completed",
            }
          );
          return;
        }

        // Find the module that contains this content
        const moduleForContent = modules.find((m) => {
          // Check if this module contains the content
          return m.moduleId === activeContent.moduleId;
        });

        if (!moduleForContent) {
          console.error("Could not find module for content:", contentId);
          toast.add(
            "Unable to locate the module for this lesson. Please refresh and try again.",
            {
              type: "error",
              title: "Mark as Completed",
            }
          );
          return;
        }

        try {
          // Use the progressAPI service to mark content as completed
          const result = await progressAPI.markContentAsCompleted(
            studentId,
            contentId,
            moduleForContent.moduleId,
            parseInt(id)
          );

          console.log("Mark as completed result:", result);

          // Update local state
          const updatedCompletedContents = [...completedContents, contentId];
          setCompletedContents(updatedCompletedContents);

          // Update progress state if available in the result
          if (result && result.updatedProgress) {
            console.log(
              "Updating progress from API response:",
              result.updatedProgress
            );
            setCourseProgress({
              progressPercentage:
                result.updatedProgress.progressPercentage || 0,
              completedModules: result.updatedProgress.completedModules || 0,
              totalModules:
                result.updatedProgress.totalModules || modules.length,
            });
          }

          // Save to localStorage as backup
          const progressData = {
            courseId: id,
            studentId,
            completedContents: updatedCompletedContents,
            lastUpdated: new Date().toISOString(),
          };

          localStorage.setItem(
            `course_progress_${id}_${studentId}`,
            JSON.stringify(progressData)
          );

          // Show success message
          toast.add("This content has been marked as completed.", {
            type: "success",
            title: "Progress Saved",
          });

          // Force a refresh of the progress data
          await fetchStudentProgress(studentId);
        } catch (apiError) {
          console.error("API Error:", apiError);

          // Handle specific error messages
          if (apiError.message && apiError.message.includes("403")) {
            toast.add(
              "Permission denied. Please sign in again to continue learning.",
              {
                type: "error",
                title: "Session expired",
              }
            );
            // Optionally refresh the token or redirect to login
            // localStorage.removeItem('token');
            // navigate('/student/signin');
          } else {
            toast.add(
              `Failed to save progress: ${
                apiError.message || "Unknown error"
              }. Please try again.`,
              {
                type: "error",
                title: "Mark as Completed",
              }
            );
          }
        }
      } catch (error) {
        console.error("Error in markAsCompleted:", error);
        toast.add("Something went wrong while saving your progress.", {
          type: "error",
          title: "Mark as Completed",
        });
      }
    } else {
      toast.add("You have already completed this content.", {
        type: "info",
        title: "Already Completed",
      });
    }
  };

  // Check if course is completed to show badge/certificate
  const checkCourseCompletion = async () => {
    try {
      console.log(
        `Checking course completion for student ${studentId} in course ${id}`
      );

      // Use the progressAPI service to check course completion
      const progressData = await progressAPI.getStudentProgress(id, studentId);
      console.log("Course completion check - progress data:", progressData);

      // Update course progress state with latest data
      setCourseProgress({
        progressPercentage: progressData.progressPercentage || 0,
        completedModules: progressData.completedModules || 0,
        totalModules: progressData.totalModules || 0,
      });

      if (progressData.progressPercentage >= 100) {
        console.log("Course completed! Showing certificate notification");
        toast.add(
          "A certificate has been issued for this course. Great job!",
          {
            type: "success",
            title: "Course completed",
            duration: 3200,
          }
        );

        // Force refresh the page to show the certificate link
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error checking course completion:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      {/* Course Progress Bar */}
      <div
        className="course-progress-bar"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          padding: "10px 20px",
        }}
      >
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div>
                  <h6 className="mb-0">{course?.title || "Course"}</h6>
                  <div className="text-muted small">
                    {courseProgress.completedModules} of{" "}
                    {courseProgress.totalModules} modules completed
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-end">
                <div className="text-end me-2" style={{ minWidth: "60px" }}>
                  <span className="fw-bold">
                    {courseProgress.progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div
                  className="progress flex-grow-1"
                  style={{ height: "10px", borderRadius: "5px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${courseProgress.progressPercentage}%`,
                      backgroundColor:
                        courseProgress.progressPercentage >= 100
                          ? "#10b981"
                          : "#3b82f6",
                    }}
                    aria-valuenow={courseProgress.progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-fluid"
        style={{ paddingTop: 16, paddingBottom: 16 }}
      >
        <div className="row">
          {/* Sidebar */}
          <aside
            className="col-12 col-lg-3"
            style={{
              background: "#ffffff",
              borderRight: "1px solid #e5e7eb",
              minHeight: "100vh",
              position: "sticky",
              top: 0,
              padding: 0,
            }}
          >
            <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
              <Link
                to="/my-courses"
                className="btn btn-outline-secondary btn-sm"
                style={{ borderRadius: 8 }}
              >
                Back to My Courses
              </Link>
              <div style={{ marginTop: 12 }}>
                <div
                  style={{ color: "#3b82f6", fontWeight: 700, fontSize: 14 }}
                >
                  {course.category?.name || "General"}
                </div>
                <h5 style={{ color: "#111827", marginTop: 8, marginBottom: 0 }}>
                  {course.title}
                </h5>
                <div style={{ color: "#6b7280" }}>
                  by {course.instructor?.firstName}{" "}
                  {course.instructor?.lastName}
                </div>
              </div>
            </div>
            <div
              style={{
                padding: 8,
                maxHeight: "calc(100vh - 92px)",
                overflowY: "auto",
              }}
            >
              {contents.map((content) => (
                <button
                  key={content.contentId}
                  onClick={() => setActiveContentId(content.contentId)}
                  className={`w-100 text-start btn ${
                    content.contentId === activeContentId
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  style={{
                    marginBottom: 8,
                    borderRadius: 10,
                    padding: "10px 12px",
                    position: "relative",
                    borderLeft: completedContents.includes(content.contentId)
                      ? "4px solid #10b981"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {completedContents.includes(content.contentId) && (
                        <span style={{ color: "#10b981", marginRight: 5 }}>
                          ✓
                        </span>
                      )}
                      {content.title}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.85 }}>
                      {content.contentType}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {content.moduleName}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Player */}
          <main className="col-12 col-lg-9" style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <span
                  style={{ color: "#2563eb", fontWeight: 700, fontSize: 12 }}
                >
                  {course.level || "Beginner"}
                </span>
                <h4 style={{ color: "#111827", marginTop: 6, marginBottom: 0 }}>
                  {activeContent?.title || "Select a lesson"}
                </h4>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: 10, padding: "8px 14px" }}
                  onClick={goPrev}
                  disabled={activeIndex <= 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-primary"
                  style={{ borderRadius: 10, padding: "8px 14px" }}
                  onClick={goNext}
                  disabled={isLast && !allCompleted}
                >
                  {isLast && allCompleted ? "Go to My Courses" : "Next"}
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
              }}
            >
              {activeContent?.contentType?.toUpperCase() === "VIDEO" ? (
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  {(() => {
                    const fileSrc = activeContent?.filePath
                      ? `https://learnhub-backend-882950565528.us-central1.run.app/api/course-contents/files/${activeContent.filePath}`
                      : "";
                    const url = activeContent?.contentUrl || "";
                    const isYouTube =
                      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/i.test(
                        url
                      );
                    const isVimeo = /vimeo\.com\//i.test(url);

                    if (isYouTube) {
                      // Normalize to embed URL
                      let videoId = "";
                      try {
                        const ytMatch = url.match(
                          /(?:v=|youtu\.be\/|embed\/)([\w-]+)/
                        );
                        videoId = ytMatch && ytMatch[1] ? ytMatch[1] : "";
                      } catch {}
                      const embed = videoId
                        ? `https://www.youtube.com/embed/${videoId}`
                        : url;
                      return (
                        <iframe
                          title="YouTube Player"
                          src={embed}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      );
                    }

                    if (isVimeo) {
                      // Try to convert to player embed
                      let videoId = "";
                      try {
                        const vmMatch = url.match(
                          /vimeo\.com\/(?:video\/)?(\d+)/
                        );
                        videoId = vmMatch && vmMatch[1] ? vmMatch[1] : "";
                      } catch {}
                      const embed = videoId
                        ? `https://player.vimeo.com/video/${videoId}`
                        : url;
                      return (
                        <iframe
                          title="Vimeo Player"
                          src={embed}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      );
                    }

                    // Default: use fileSrc if available, else try the raw URL in a <video> tag
                    const finalSrc = fileSrc || url;
                    return (
                      <video
                        controls
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          border: "0",
                          background: "#000",
                        }}
                        src={finalSrc}
                        onError={(e) =>
                          console.error(
                            "Video load error:",
                            e,
                            "URL:",
                            e.target.src,
                            "content:",
                            activeContent
                          )
                        }
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  })()}
                </div>
              ) : activeContent?.contentType?.toUpperCase() === "DOCUMENT" ||
                activeContent?.contentType?.toUpperCase() === "READING" ? (
                <div style={{ padding: 20, color: "#1f2937", lineHeight: 1.7 }}>
                  <p style={{ margin: 0, marginBottom: 12 }}>
                    <strong>Document:</strong> {activeContent.title}
                  </p>
                  {activeContent.filePath ? (
                    <a
                      href={`https://learnhub-backend-882950565528.us-central1.run.app/api/course-contents/files/${activeContent.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Download Document
                    </a>
                  ) : (
                    <div
                      style={{
                        padding: "20px",
                        background: "#f9fafb",
                        borderRadius: "8px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {activeContent.contentUrl || "No content available"}
                    </div>
                  )}
                </div>
              ) : activeContent?.contentType?.toUpperCase() === "QUIZ" ? (
                <QuizPlayer content={activeContent} studentId={studentId} />
              ) : (
                <div style={{ padding: 20, color: "#1f2937", lineHeight: 1.7 }}>
                  <p style={{ margin: 0 }}>
                    {activeContent?.description || "No content available"}
                  </p>
                </div>
              )}
            </div>

            {/* Mark as Completed Button */}
            {activeContentId && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "#f9fafb",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                    {completedContents.includes(activeContentId)
                      ? "You have completed this lesson"
                      : "Track your progress"}
                  </h5>
                  <p
                    style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}
                  >
                    {completedContents.includes(activeContentId)
                      ? "Great job! Continue to the next lesson."
                      : "Mark this lesson as completed when you finish."}
                  </p>
                </div>
                <button
                  className={`btn ${
                    completedContents.includes(activeContentId)
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                  style={{ borderRadius: 8, padding: "8px 16px" }}
                  onClick={() => markAsCompleted(activeContentId)}
                  disabled={completedContents.includes(activeContentId)}
                >
                  {completedContents.includes(activeContentId)
                    ? "Completed ✓"
                    : "Mark as Completed"}
                </button>
              </div>
            )}

            {/* Navigation buttons for mobile */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
              className="d-lg-none"
            >
              <button
                className="btn btn-outline-secondary"
                style={{ borderRadius: 8, flex: 1 }}
                onClick={goPrev}
                disabled={activeIndex <= 0}
              >
                Previous Lesson
              </button>
              <button
                className="btn btn-primary"
                style={{ borderRadius: 8, flex: 1 }}
                onClick={goNext}
                disabled={isLast && !allCompleted}
              >
                {isLast && allCompleted ? "Go to My Courses" : "Next Lesson"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
