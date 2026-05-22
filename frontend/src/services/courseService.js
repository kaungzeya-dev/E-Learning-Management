import api from './api';

/**
 * Course Service
 * Handles all course-related API calls
 */

const courseService = {
  /**
   * Get all courses for the authenticated instructor
   * @returns {Promise} Array of courses
   */
  getAllMyCourses: async () => {

    try {
      const response = await api.get('/instructor/courses');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch courses.';
    }
  },

  /**
   * Get a specific course by ID
   * @param {number} courseId
   * @returns {Promise} Course data
   */
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/instructor/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch course.';
    }
  },

  /**
   * Create a new course
   * @param {Object} courseData - { categoryId, title, description, status }
   * @returns {Promise} Created course data
   */
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/instructor/courses', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create course.';
    }
  },

  /**
   * Update an existing course
   * @param {number} courseId
   * @param {Object} courseData - { categoryId, title, description, status }
   * @returns {Promise} Updated course data
   */
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/instructor/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update course.';
    }
  },

  /**
   * Delete a course
   * @param {number} courseId
   * @returns {Promise}
   */
  deleteCourse: async (courseId) => {
    try {
      await api.delete(`/instructor/courses/${courseId}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete course.';
    }
  },
};

export default courseService;
