import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import StudentSignIn from "./pages/students/StudentSignIn.jsx";
import StudentSignUp from "./pages/students/StudentSignUp.jsx";
import InstructorSignIn from "./pages/instructors/InstructorSignIn.jsx";
import InstructorSignUp from "./pages/instructors/InstructorSignUp.jsx";
import InstructorDashboard from "./pages/instructors/InstructorDashboard.jsx";
import CourseManage from "./pages/instructors/CourseManage.jsx";
import ModuleContentManage from "./pages/instructors/ModuleContentManage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentHome from "./pages/students/StudentHome.jsx";
import Enroll from "./pages/students/Enroll.jsx";
import CoursePlayer from "./pages/instructors/CoursePlayer.jsx";
import MyCourses from "./pages/students/MyCourses.jsx";
import Accomplishments from "./pages/students/Accomplishments.jsx";
import CertificateViewPage from "./pages/students/CertificateViewPage.jsx";
import VerifyCertificate from "./pages/students/VerifyCertificate.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import StudentSettings from "./pages/students/StudentSettings.jsx";
import InstructorSettings from "./pages/instructors/InstructorSettings.jsx";
import { ToastProvider } from "./state/ToastContext.jsx";

const router = createBrowserRouter([
  { path: "/", element: <StudentHome /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/student/signin", element: <StudentSignIn /> },
  { path: "/student/signup", element: <StudentSignUp /> },
  { path: "/instructor/signin", element: <InstructorSignIn /> },
  { path: "/instructor/signup", element: <InstructorSignUp /> },
  { path: "/instructor/dashboard", element: <InstructorDashboard /> },
  { path: "/instructor/course/:courseId", element: <CourseManage /> },
  {
    path: "/instructor/course/:courseId/module/:moduleId",
    element: <ModuleContentManage />,
  },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/enroll/:id", element: <Enroll /> },
  { path: "/course-player/:id", element: <CoursePlayer /> },
  { path: "/my-courses", element: <MyCourses /> },
  { path: "/accomplishments", element: <Accomplishments /> },
  { path: "/student/settings", element: <StudentSettings /> },
  { path: "/instructor/settings", element: <InstructorSettings /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/certificate/:id", element: <CertificateViewPage /> },
  { path: "/verify-certificate/:code", element: <VerifyCertificate /> },
  { path: "/verify-certificate", element: <VerifyCertificate /> },
  { path: "/app", element: <App /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
