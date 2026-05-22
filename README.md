

# E-Learning Management System (LMS)

**Repository:** [github.com/kaungzeya-dev/E-Learning-Management](https://github.com/kaungzeya-dev/E-Learning-Management)

A full-stack learning platform with course delivery, assessments, and role-based access for admins, instructors, and students.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Setup & Installation](#setup--installation)
6. [Usage](#usage)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [License](#license)
12. [Contributors](#contributors)
13. [Support](#support)

---

## 📖 Overview

The E-Learning Management System is a comprehensive, database-driven web application designed to centralize educational resources, streamline course management, and enhance student engagement. It provides a unified platform for instructors, students, and administrators, featuring a robust backend (Spring Boot), a responsive frontend (React.js), and a relational MySQL database.

---

## 🚀 Features
- User authentication & authorization (JWT)
- Course & module management
- File upload (videos, resources)
- Student enrollment & progress tracking
- Quiz & assignment system
- Gamification (badges, achievements)
- Certificate generation
- Admin dashboard APIs
- RESTful API design
- Dockerized deployment

---

## 🛠️ Tech Stack
- **Backend:** Spring Boot (Java 17), Spring Security, JWT, Maven
- **Frontend:** React.js, CSS, Styled Components, Axios
- **Database:** MySQL 8.0
- **Containerization:** Docker
- **Storage:** Local file storage for course content (Videos/PDFs)

---

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │ <--> │   Backend   │ <--> │   Database  │
└─────────────┘      └─────────────┘      └─────────────┘
		React           Spring Boot           MySQL
```

---

## ⚡ Setup & Installation

### Prerequisites
- Java 17+
- Node.js & npm
- MySQL Server
- Docker (optional)

### Local Setup
1. Clone the repository:
	```bash
	git clone https://github.com/kaungzeya-dev/E-Learning-Management.git
	cd E-Learning-Management
	```
2. Configure database settings (see `backend/.env.local` for local overrides, or `backend/src/main/resources/application.properties`). For a detailed walkthrough, see [LOCAL_SETUP_USER_MANUAL.md](LOCAL_SETUP_USER_MANUAL.md).
3. Create the database using `backend/database/lms_schema.sql`.
4. Build & run backend:
	```bash
	cd backend
	./mvnw spring-boot:run
	```
5. Build & run frontend:
	```bash
	cd ../frontend
	npm install
	npm run dev
	```

### Deploy on Railway (MySQL + API + UI)

Step-by-step variables, root directories, and troubleshooting: **[RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)**.

---

## ▶️ Usage

Start the backend server and interact with the RESTful API using tools like Postman, curl, or via the frontend application at `http://localhost:5173`.

---

## 📚 API Reference

Base URL: `/api`

### Course Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/courses` | List all courses |
| GET    | `/courses/{id}` | Get course by ID |
| POST   | `/courses` | Create new course |
| PUT    | `/courses/{id}` | Update course |
| DELETE | `/courses/{id}` | Delete course |

### Module Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/courses/{courseId}/modules` | List modules |
| POST   | `/courses/{courseId}/modules` | Add module |
| PUT    | `/modules/{id}` | Update module |
| DELETE | `/modules/{id}` | Delete module |

### Content Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/modules/{moduleId}/contents` | List contents |
| POST   | `/modules/{moduleId}/contents` | Add content |
| PUT    | `/contents/{id}` | Update content |
| DELETE | `/contents/{id}` | Delete content |

### Enrollment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/enrollments` | Enroll student |
| GET    | `/enrollments/{userId}` | Get user enrollments |

### Progress Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/progress/{userId}/{courseId}` | Get progress |
| POST   | `/progress` | Update progress |

### Quiz Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/quizzes/{courseId}` | List quizzes |
| POST   | `/quizzes` | Create quiz |
| POST   | `/quizzes/{quizId}/attempt` | Submit attempt |

### Certificate Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/certificates/{userId}` | List certificates |

### Authentication Endpoints (Planned)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create new user |
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| GET | `/users/email/{email}` | Get user by email |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

---

## 🗄️ Database Schema

The system utilizes a relational database with 15+ normalized tables including:

1. **User Management**: `ADMINS`, `INSTRUCTORS`, `STUDENTS`
2. **Course Structure**: `CATEGORIES`, `COURSES`, `COURSE_MODULES`, `COURSE_CONTENT`
3. **Engagement**: `ENROLLMENTS`, `STUDENT_PROGRESS`
4. **Assessments & Rewards**: `QUIZZES`, `QUIZ_QUESTIONS`, `QUIZ_ATTEMPTS`, `BADGES`, `USER_BADGES`, `CERTIFICATES`

See [`backend/database/lms_schema.sql`](backend/database/lms_schema.sql) for the complete schema.

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### API Testing
1. Start the application
2. Import Postman collection
3. Run test requests

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow Java naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Write unit tests for new features
- Update documentation

---

## 📝 License

See the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

| Name            | Role               |
| :-------------- | :----------------- |
| Nadi Zeya       | Project management |
| Kyaw Hmue San   | Lead developer     |
| Hein Htut Aung  | Data analyst       |
| Nang Shwe Sin   | Frontend developer |
| Min Thein Kyaw  | Backend developer  |
| Aung Kyaw Soe   | QA lead            |

---

## 📞 Support

Open an issue on GitHub for bugs or questions.

---