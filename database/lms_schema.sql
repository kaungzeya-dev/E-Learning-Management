-- ============================================
-- E-Learning Management System (LMS) Database Schema
-- ============================================
-- Database: lms_elearn_db
-- Total Tables: 15
-- ============================================

USE lms_elearn_db;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS USER_BADGES;
DROP TABLE IF EXISTS BADGES;
DROP TABLE IF EXISTS QUIZ_ATTEMPTS;
DROP TABLE IF EXISTS QUIZ_QUESTIONS;
DROP TABLE IF EXISTS QUIZZES;
DROP TABLE IF EXISTS CERTIFICATES;
DROP TABLE IF EXISTS STUDENT_PROGRESS;
DROP TABLE IF EXISTS ENROLLMENTS;
DROP TABLE IF EXISTS COURSE_CONTENT;
DROP TABLE IF EXISTS COURSE_MODULES;
DROP TABLE IF EXISTS COURSES;
DROP TABLE IF EXISTS CATEGORIES;
DROP TABLE IF EXISTS INSTRUCTORS;
DROP TABLE IF EXISTS STUDENTS;
DROP TABLE IF EXISTS ADMINS;

-- ============================================
-- 1. USER MANAGEMENT (4 TABLES)
-- ============================================

-- Table 1: ADMINS
CREATE TABLE ADMINS (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    permissions TEXT COMMENT 'JSON or comma-separated list of permissions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: INSTRUCTORS
CREATE TABLE INSTRUCTORS (
    instructor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    expertise VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: STUDENTS
CREATE TABLE STUDENTS (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 4: CATEGORIES
CREATE TABLE CATEGORIES (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. COURSE AND CONTENT STRUCTURE (3 TABLES)
-- ============================================

-- Table 5: COURSES
CREATE TABLE COURSES (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    instructor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Draft', 'Published') DEFAULT 'Draft',
    thumbnail LONGTEXT COMMENT 'Base64 encoded image for course',
    level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    duration VARCHAR(50) DEFAULT '6 weeks' COMMENT 'Estimated course duration',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (instructor_id) REFERENCES INSTRUCTORS(instructor_id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_status (status),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 6: COURSE_MODULES
CREATE TABLE COURSE_MODULES (
    module_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    module_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_order (module_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 7: COURSE_CONTENT
CREATE TABLE COURSE_CONTENT (
    content_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('Video', 'Reading', 'Quiz') NOT NULL,
    content_url VARCHAR(500),
    file_path VARCHAR(500) COMMENT 'Path to uploaded file (videos, PDFs, etc.)',
    content_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES COURSE_MODULES(module_id) ON DELETE CASCADE,
    INDEX idx_module (module_id),
    INDEX idx_content_type (content_type),
    INDEX idx_order (content_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ENROLLMENT AND PROGRESS TRACKING (3 TABLES)
-- ============================================

-- Table 8: ENROLLMENTS
CREATE TABLE ENROLLMENTS (
    enrollment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
    UNIQUE KEY unique_enrollment (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_status (completion_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 9: STUDENT_PROGRESS
CREATE TABLE STUDENT_PROGRESS (
    progress_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_progress (student_id, content_id),
    FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES COURSE_CONTENT(content_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_content (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 10: CERTIFICATES
CREATE TABLE CERTIFICATES (
    certificate_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unique_code VARCHAR(100) UNIQUE NOT NULL,
    FOREIGN KEY (enrollment_id) REFERENCES ENROLLMENTS(enrollment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_student (student_id),
    INDEX idx_unique_code (unique_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ASSESSMENTS AND GRADING (3 TABLES)
-- ============================================

-- Table 11: QUIZZES
CREATE TABLE QUIZZES (
    quiz_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    max_score DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES COURSE_CONTENT(content_id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 12: QUIZ_QUESTIONS
CREATE TABLE QUIZ_QUESTIONS (
    question_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT COMMENT 'JSON array of options for MCQ: ["Option A", "Option B", "Option C", "Option D"]',
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES QUIZZES(quiz_id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 13: QUIZ_ATTEMPTS
CREATE TABLE QUIZ_ATTEMPTS (
    attempt_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES QUIZZES(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id),
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. GAMIFICATION AND ENGAGEMENT (2 TABLES)
-- ============================================

-- Table 14: BADGES
CREATE TABLE BADGES (
    badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 15: USER_BADGES
CREATE TABLE USER_BADGES (
    user_badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_badge (student_id, badge_id),
    FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES BADGES(badge_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_badge (badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample admins
INSERT INTO ADMINS (first_name, last_name, email, password_hash, permissions) VALUES
('Admin', 'User', 'admin@lms.com', 'password', 'all,manage_users,manage_courses,manage_content,view_reports');

-- Insert sample instructors
INSERT INTO INSTRUCTORS (first_name, last_name, email, password_hash, bio, expertise) VALUES
('Jane', 'Smith', 'jane.smith@example.com', '$2a$10$u1YVQv1lX8r0mT3k1mQxpu7wG3c1d8bWb6x8h1Hq3yJbq0nG8l9J6', 'Experienced web developer with 10+ years in the industry', 'Web Development, JavaScript, React'),
('Bob', 'Johnson', 'bob.johnson@example.com', '$2a$10$u1YVQv1lX8r0mT3k1mQxpu7wG3c1d8bWb6x8h1Hq3yJbq0nG8l9J6', 'Data scientist specializing in machine learning', 'Data Science, Python, Machine Learning');

-- Insert sample students
INSERT INTO STUDENTS (first_name, last_name, email, password_hash) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$u1YVQv1lX8r0mT3k1mQxpu7wG3c1d8bWb6x8h1Hq3yJbq0nG8l9J6'),
('Alice', 'Williams', 'alice.williams@example.com', '$2a$10$u1YVQv1lX8r0mT3k1mQxpu7wG3c1d8bWb6x8h1Hq3yJbq0nG8l9J6');

-- Insert categories
INSERT INTO CATEGORIES (name, description) VALUES
('Web Development', 'Learn web development technologies including HTML, CSS, JavaScript, and frameworks'),
('Data Science', 'Master data analysis, machine learning, and statistical methods'),
('Mobile Development', 'Build iOS and Android applications'),
('Business', 'Business management, entrepreneurship, and leadership courses'),
('Design', 'Graphic design, UI/UX, and creative skills');

-- Insert sample courses
INSERT INTO COURSES (category_id, instructor_id, title, description, status) VALUES
(1, 1, 'Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, React, Node.js and more', 'Published'),
(2, 2, 'Data Science Fundamentals', 'Introduction to data analysis and machine learning', 'Published'),
(1, 1, 'Advanced JavaScript', 'Deep dive into JavaScript ES6+ features', 'Draft');

-- Insert course modules
INSERT INTO COURSE_MODULES (course_id, title, module_order) VALUES
(1, 'Introduction to HTML', 1),
(1, 'CSS Fundamentals', 2),
(1, 'JavaScript Basics', 3),
(2, 'Introduction to Data Science', 1),
(2, 'Python for Data Analysis', 2);

-- Insert course content
INSERT INTO COURSE_CONTENT (module_id, title, content_type, content_url, content_order) VALUES
(1, 'What is HTML?', 'Video', 'https://example.com/videos/html-intro.mp4', 1),
(1, 'HTML Tags and Elements', 'Reading', 'https://example.com/readings/html-tags.pdf', 2),
(1, 'HTML Quiz', 'Quiz', NULL, 3),
(2, 'CSS Selectors', 'Video', 'https://example.com/videos/css-selectors.mp4', 1),
(3, 'JavaScript Variables', 'Video', 'https://example.com/videos/js-variables.mp4', 1);

-- Insert enrollments
INSERT INTO ENROLLMENTS (student_id, course_id, completion_status) VALUES
(1, 1, 'In Progress'),
(2, 1, 'In Progress'),
(1, 2, 'Completed');

-- Insert student progress
INSERT INTO STUDENT_PROGRESS (student_id, content_id) VALUES
(1, 1),
(1, 2),
(2, 1);

-- Insert certificates
INSERT INTO CERTIFICATES (enrollment_id, student_id, unique_code) VALUES
(3, 1, 'CERT-2024-001-ABC123XYZ');

-- Insert quizzes
INSERT INTO QUIZZES (content_id, title, max_score) VALUES
(3, 'HTML Basics Quiz', 100.00);

-- Insert quiz questions
INSERT INTO QUIZ_QUESTIONS (quiz_id, question_text, correct_answer) VALUES
(1, 'What does HTML stand for?', 'HyperText Markup Language'),
(1, 'Which tag is used for the largest heading?', '<h1>');

-- Insert quiz attempts
INSERT INTO QUIZ_ATTEMPTS (quiz_id, student_id, score) VALUES
(1, 1, 85.00),
(1, 2, 92.00);

-- Insert badges
INSERT INTO BADGES (name, description, icon_url) VALUES
('First Course', 'Completed your first course', 'https://example.com/badges/first-course.png'),
('Quiz Master', 'Scored 100% on a quiz', 'https://example.com/badges/quiz-master.png'),
('Early Bird', 'Enrolled in a course within first week', 'https://example.com/badges/early-bird.png');

-- Insert user badges
INSERT INTO USER_BADGES (student_id, badge_id) VALUES
(1, 1),
(1, 3),
(2, 3);

-- ============================================
-- CREATE USEFUL VIEWS
-- ============================================

-- View: Course Overview with Instructor Details
CREATE OR REPLACE VIEW v_course_overview AS
SELECT 
    c.course_id,
    c.title AS course_title,
    c.description,
    c.status,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
    i.email AS instructor_email,
    cat.name AS category_name,
    COUNT(DISTINCT e.enrollment_id) AS total_enrollments,
    COUNT(DISTINCT cm.module_id) AS total_modules
FROM COURSES c
JOIN INSTRUCTORS i ON c.instructor_id = i.instructor_id
JOIN CATEGORIES cat ON c.category_id = cat.category_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
LEFT JOIN COURSE_MODULES cm ON c.course_id = cm.course_id
GROUP BY c.course_id, c.title, c.description, c.status, 
         i.first_name, i.last_name, i.email, cat.name;

-- View: Student Progress Dashboard
CREATE OR REPLACE VIEW v_student_dashboard AS
SELECT 
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.email,
    COUNT(DISTINCT e.enrollment_id) AS total_enrollments,
    COUNT(DISTINCT CASE WHEN e.completion_status = 'Completed' THEN e.enrollment_id END) AS completed_courses,
    COUNT(DISTINCT sp.progress_id) AS completed_content,
    COUNT(DISTINCT ub.badge_id) AS total_badges,
    COUNT(DISTINCT cert.certificate_id) AS total_certificates
FROM STUDENTS s
LEFT JOIN ENROLLMENTS e ON s.student_id = e.student_id
LEFT JOIN STUDENT_PROGRESS sp ON s.student_id = sp.student_id
LEFT JOIN USER_BADGES ub ON s.student_id = ub.student_id
LEFT JOIN CERTIFICATES cert ON s.student_id = cert.student_id
GROUP BY s.student_id, s.first_name, s.last_name, s.email;

-- View: Instructor Course Statistics
CREATE OR REPLACE VIEW v_instructor_stats AS
SELECT 
    i.instructor_id,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
    COUNT(DISTINCT c.course_id) AS total_courses,
    COUNT(DISTINCT CASE WHEN c.status = 'Published' THEN c.course_id END) AS published_courses,
    COUNT(DISTINCT e.enrollment_id) AS total_students
FROM INSTRUCTORS i
JOIN COURSES c ON i.instructor_id = c.instructor_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
GROUP BY i.instructor_id, i.first_name, i.last_name;

-- ============================================
-- END OF SCHEMA
-- ============================================
