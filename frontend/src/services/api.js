import apiClient from "../api/apiClient"; // adjust import path

const endpoint = (path) => path; // helper, optional

/* ---------------------- COURSE API ---------------------- */
export const courseAPI = {
  getAllCourses: () =>
    apiClient.get(endpoint("/courses")).then((r) => r.data.data),

  getCourseById: (id) =>
    apiClient.get(endpoint(`/courses/${id}`)).then((r) => r.data.data),

  getCoursesByStatus: (status) =>
    apiClient
      .get(endpoint(`/courses/status/${status}`))
      .then((r) => r.data.data),

  createCourse: (data) =>
    apiClient.post(endpoint("/courses"), data).then((r) => r.data.data),

  updateCourse: (id, data) =>
    apiClient.put(endpoint(`/courses/${id}`), data).then((r) => r.data.data),

  deleteCourse: (id) =>
    apiClient.delete(endpoint(`/courses/${id}`)).then((r) => r.data),
};

/* ------------------ COURSE MODULE API ------------------- */
export const courseModuleAPI = {
  getModulesByCourseId: (courseId) =>
    apiClient
      .get(endpoint(`/course-modules/course/${courseId}`))
      .then((r) => r.data.data),

  createModule: (data) =>
    apiClient.post(endpoint("/course-modules"), data).then((r) => r.data.data),

  createModuleWithContents: (data) =>
    apiClient
      .post(endpoint("/course-modules/with-contents"), data)
      .then((r) => r.data.data),
};

/* ------------------- COURSE CONTENT API ------------------ */
export const courseContentAPI = {
  getContentsByModuleId: (moduleId) =>
    apiClient
      .get(endpoint(`/course-contents/module/${moduleId}`))
      .then((r) => r.data.data),

  createContent: (data) =>
    apiClient.post(endpoint("/course-contents"), data).then((r) => r.data.data),

  updateContent: (id, data) =>
    apiClient
      .put(endpoint(`/course-contents/${id}`), data)
      .then((r) => r.data.data),

  uploadFile: (file, moduleId, title, contentType, contentOrder) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("moduleId", moduleId);
    formData.append("title", title);
    formData.append("contentType", contentType);
    if (contentOrder !== undefined)
      formData.append("contentOrder", contentOrder);

    return apiClient
      .post("/course-contents/upload", formData)
      .then((r) => r.data.data);
  },

  getFileUrl: (contentType, fileName) =>
    `${apiClient.defaults.baseURL}/course-contents/files/${contentType}/${fileName}`,
};

/* ---------------------- ENROLLMENT API ---------------------- */
export const enrollmentAPI = {
  enrollInCourse: (studentId, courseId) =>
    apiClient
      .post("/enrollments", { studentId, courseId })
      .then((r) => r.data.data),

  getEnrollmentsByStudentId: (studentId) =>
    apiClient.get(`/enrollments/student/${studentId}`).then((r) => r.data.data),

  checkEnrollment: (studentId, courseId) =>
    apiClient
      .get(`/enrollments/check`, { params: { studentId, courseId } })
      .then((r) => r.data.isEnrolled === true)
      .catch(() => false),
};

/* ---------------------- OTHER API GROUPS ---------------------- */
export const categoryAPI = {
  getAllCategories: () =>
    apiClient.get("/categories").then((r) => r.data.data || []),
};

export const instructorAPI = {
  getInstructorById: (id) =>
    apiClient.get(`/instructors/${id}`).then((r) => r.data.data),

  deleteInstructor: (id) =>
    apiClient.delete(`/instructors/${id}`).then(() => true),
};

export const studentAPI = {
  getStudentById: (id) => apiClient.get(`/students/${id}`).then((r) => r.data),

  deleteStudent: (id) => apiClient.delete(`/students/${id}`).then(() => true),
};

/* ------------------- QUIZ API ------------------ */
export const quizAPI = {
  getQuizForStudent: (quizId) =>
    apiClient.get(`/quizzes/${quizId}/student`).then((r) => r.data.data),

  getQuizByContentId: async (contentId) => {
    try {
      const quiz = await apiClient.get(`/quizzes/content/${contentId}`);
      if (!quiz.data?.data?.quizId) return null;
      return quizAPI.getQuizForStudent(quiz.data.data.quizId);
    } catch {
      return null;
    }
  },

  submitQuizAttempt: (quizId, studentId, answers) =>
    apiClient
      .post(`/quizzes/attempt`, { quizId, studentId, answers })
      .then((r) => r.data.data),

  getStudentAttempts: (studentId) =>
    apiClient
      .get(`/quizzes/student/${studentId}/attempts`)
      .then((r) => r.data.data),
};

/* ------------------- PROGRESS API ------------------ */
export const progressAPI = {
  getStudentProgress: (courseId, studentId) =>
    apiClient
      .get(`/progress/course/${courseId}/student/${studentId}`)
      .then((r) => r.data),

  markContentAsCompleted: async (studentId, contentId, moduleId, courseId) => {
    const resp = await apiClient.post("/progress/mark-completed", {
      studentId,
      contentId,
      moduleId,
      courseId,
    });
    const updatedProgress = await progressAPI.getStudentProgress(
      courseId,
      studentId
    );
    return { ...resp.data, updatedProgress };
  },
};

/* ------------------- CERTIFICATES ------------------ */
export const certificateAPI = {
  getCertificateById: (id) =>
    apiClient.get(`/certificates/${id}`).then((r) => r.data),

  // Backend exposes student certificates at /certificates/student/{studentId}
  // so fetch those and find the one matching the courseId
  getCertificateByCourseAndStudent: async (courseId, studentId) => {
    try {
      const certs = await apiClient.get(`/certificates/student/${studentId}`).then((r) => r.data || []);
      if (!Array.isArray(certs)) return null;
      return certs.find((c) => String(c.courseId) === String(courseId)) || null;
    } catch (e) {
      return null;
    }
  },

  // Backend endpoint expects path params: /certificates/generate/student/{studentId}/course/{courseId}
  generateCertificate: (courseId, studentId) =>
    apiClient
      .post(`/certificates/generate/student/${studentId}/course/${courseId}`)
      .then((r) => r.data),

  getStudentCertificates: (studentId) =>
    apiClient.get(`/certificates/student/${studentId}`).then((r) => r.data || []),
  verifyCertificate: (uniqueCode) =>
    apiClient.get(`/certificates/verify/${uniqueCode}`).then((r) => r.data),
};

/* ------------------- BADGE API ------------------ */
export const badgeAPI = {
  getStudentBadges: (studentId) =>
    apiClient
      .get(`/badges/student/${studentId}`)
      .then((r) => Array.isArray(r.data) ? r.data : (r.data.data || [])),
};

/* ---------------------- EXPORT ---------------------- */
export default {
  courseAPI,
  courseModuleAPI,
  courseContentAPI,
  enrollmentAPI,
  categoryAPI,
  instructorAPI,
  studentAPI,
  quizAPI,
  progressAPI,
  certificateAPI,
  badgeAPI,
};
