import { useEffect, useState } from "react";
import { useToast } from "../../state/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../state/AuthContext.jsx";
import Modal from "../../components/admin/Modal.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import DetailSection from "../../components/admin/DetailSection.jsx";
import ListGroupItem from "../../components/admin/ListGroupItem.jsx";
import { useDataFetch } from "../../hooks/useDataFetch.js";
import DetailModal from "../../components/admin/DetailModal.jsx";
import RowActionMenu from "../../components/admin/RowActionMenu.jsx";
import { formatDate } from "../../utils/format.js";
import AdminAnalytics from "../../components/AdminAnalytics.jsx";
import "../styles/InstructorDashboard.css";
import "../styles/AdminDashboard.css";
import CourseModal from "../../components/CourseModal.jsx";

export default function AdminDashboard() {
  const toast = useToast();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    if (!admin) navigate("/admin/login");
  }, [admin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="instructor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-name">LearnHub Admin</span>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">
                <span>{admin?.firstName?.charAt(0) || "A"}</span>
              </div>
              <div className="user-details">
                <span className="user-name">
                  {admin?.firstName} {admin?.lastName}
                </span>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${tab === "dashboard" ? "active" : ""}`}
              onClick={() => setTab("dashboard")}
            >
              <span className="nav-icon">🏠</span>
              Overview
            </button>
            <button
              className={`nav-item ${tab === "admins" ? "active" : ""}`}
              onClick={() => setTab("admins")}
            >
              <span className="nav-icon">🛠️</span>
              Admins
            </button>
            <button
              className={`nav-item ${tab === "students" ? "active" : ""}`}
              onClick={() => setTab("students")}
            >
              <span className="nav-icon">👨‍🎓</span>
              Students
            </button>
            <button
              className={`nav-item ${tab === "instructors" ? "active" : ""}`}
              onClick={() => setTab("instructors")}
            >
              <span className="nav-icon">👩‍🏫</span>
              Instructors
            </button>
            <button
              className={`nav-item ${tab === "courses" ? "active" : ""}`}
              onClick={() => setTab("courses")}
            >
              <span className="nav-icon">📚</span>
              Courses
            </button>
            <button
              className={`nav-item ${tab === "enrollment" ? "active" : ""}`}
              onClick={() => setTab("enrollment")}
            >
              <span className="nav-icon">📝</span>
              Enrollment
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {tab === "dashboard" && <AdminAnalytics />}
          {tab === "admins" && <AdminsTab />}
          {tab === "courses" && <CoursesTab />}
          {tab === "students" && <StudentsTab />}
          {tab === "instructors" && <InstructorsTab />}
          {tab === "enrollment" && <EnrollmentTab />}
        </main>
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title text-info">{title}</h5>
        <p className="card-text text-secondary mb-0">
          APIs not wired yet. Coming soon.
        </p>
      </div>
    </div>
  );
}

function AdminsTab() {
  const toast = useToast();
  const { data: list, loading, error, refetch } = useDataFetch("/admins");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    reason: "",
    open: false,
  });
  const [editState, setEditState] = useState({
    open: false,
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    permissions: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const createAdmin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await apiClient.post("/admins", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        permissions: "all",
      });
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      refetch();
      toast.add("Admin created successfully");
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to create admin");
    }
  };

  const performDelete = async () => {
    if (!deleteState.id) return;
    try {
      await apiClient.delete(`/admins/${deleteState.id}`, {
        data: { reason: deleteState.reason },
      });
      setDeleteState({ id: null, reason: "", open: false });
      refetch();
      toast.add("Admin deleted successfully");
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/admins/${editState.id}`, {
        firstName: editState.firstName,
        lastName: editState.lastName,
        email: editState.email,
        password: "",
        permissions: editState.permissions || "all",
      });
      setEditState({
        open: false,
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        permissions: "",
      });
      refetch();
      toast.add("Admin updated successfully");
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to update admin");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (a) => `${a.firstName} ${a.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "createdAt",
      label: "Created at",
      render: (a) => formatDate(a.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (a) => (
        // Use a div to hold both buttons
        <div>
          <button
            className="btn btn-sm btn-outline-info me-2" // "me-2" adds margin to the right
            onClick={() =>
              setEditState({
                open: true,
                id: a.adminId || a.id,
                firstName: a.firstName || "",
                lastName: a.lastName || "",
                email: a.email || "",
                permissions: a.permissions || "",
              })
            }
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() =>
              setDeleteState({ id: a.adminId || a.id, reason: "", open: true })
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredList = (list || []).filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
    const email = (a.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
          <h5 className="card-title m-0 text-info">Admins List</h5>
          <div className="d-flex align-items-center justify-content-end" style={{ minWidth: "260px" }}>
            <div className="input-group input-group-sm me-2">
              <span
                className="input-group-text"
                // Use the cyan theme color for the icon box
                style={{
                  backgroundColor: "#0dcaf0",
                  borderColor: "#0dcaf0"
                }}
              >
                {/* Use a clean, white SVG icon instead of the emoji */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <input
                type="text"
                className="form-control"
                // Use the cyan theme color for the input border
                style={{ borderColor: "#0dcaf0" }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-info btn-sm text-white"
              onClick={() => setCreateOpen(true)}
            >
              Create
            </button>
          </div>
        </div>
        {(error || errorMsg) && (
          <div className="alert alert-danger" role="alert">
            {error || errorMsg}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredList}
            emptyMessage="No admins found"
          />
        )}

        <Modal
          show={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Create Admin"
        >
          <div className="modal-body">
            <form className="row g-2" onSubmit={createAdmin}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-info text-white" onClick={createAdmin}>
              Create
            </button>
          </div>
        </Modal>

        <Modal
          show={deleteState.open}
          onClose={() => setDeleteState({ id: null, reason: "", open: false })}
          title="Delete Admin"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              value={deleteState.reason}
              onChange={(e) =>
                setDeleteState({ ...deleteState, reason: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteState({ id: null, reason: "", open: false })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={performDelete}
              disabled={!deleteState.reason.trim()}
            >
              Delete
            </button>
          </div>
        </Modal>

        <Modal
          show={editState.open}
          onClose={() =>
            setEditState({
              open: false,
              id: null,
              firstName: "",
              lastName: "",
              email: "",
              permissions: "",
            })
          }
          title="Edit Admin"
        >
          <div className="modal-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="First name"
                  value={editState.firstName}
                  onChange={(e) =>
                    setEditState({ ...editState, firstName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Last name"
                  value={editState.lastName}
                  onChange={(e) =>
                    setEditState({ ...editState, lastName: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Email"
                  type="email"
                  value={editState.email}
                  onChange={(e) =>
                    setEditState({ ...editState, email: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Permissions"
                  value={editState.permissions}
                  onChange={(e) =>
                    setEditState({ ...editState, permissions: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditState({
                  open: false,
                  id: null,
                  firstName: "",
                  lastName: "",
                  email: "",
                  permissions: "",
                })
              }
            >
              Cancel
            </button>
            <button className="btn btn-info text-white" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </Modal>

        {/* No full admin details modal for now */}
      </div>
    </div>
  );
}

function StudentsTab() {
  const toast = useToast();
  const { data: list, loading, error, refetch } = useDataFetch("/students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [details, setDetails] = useState({
    certificates: [],
    badges: [],
    enrollments: [],
    courses: [],
    loading: false,
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    open: false,
    reason: "",
  });
  const [search, setSearch] = useState("");

  const fetchStudentDetails = async (studentId) => {
    setDetails({
      certificates: [],
      badges: [],
      enrollments: [],
      courses: [],
      loading: true,
    });
    try {
      const studentRes = await apiClient.get(`/students/${studentId}`);
      const student = studentRes.data;

      let enrollments = [],
        courses = [];
      try {
        const enrollmentRes = await apiClient.get(
          `/enrollments/student/${studentId}`
        );
        enrollments = enrollmentRes.data?.data || [];
        courses = await Promise.all(
          enrollments.map((e) =>
            apiClient
              .get(`/courses/${e.courseId}`)
              .then((r) => r.data?.data || null)
              .catch(() => null)
          )
        );
      } catch (e) {
        console.error("Failed to load enrollments:", e);
      }

      let certificates = [];
      try {
        const certRes = await apiClient.get(
          `/certificates/student/${studentId}`
        );
        certificates = certRes.data?.data || certRes.data || [];
      } catch (e) {
        console.log("Certificates API not available yet");
      }

      let badges = [];
      try {
        const badgeRes = await apiClient.get(`/badges/student/${studentId}`);
        badges = badgeRes.data?.data || badgeRes.data || [];
      } catch (e) {
        console.log("Badges API not available yet");
      }

      setDetails({
        certificates,
        badges,
        enrollments,
        courses,
        loading: false,
      });
      setSelectedStudent(student);
    } catch (e) {
      console.error(e);
      setDetails({
        certificates: [],
        badges: [],
        enrollments: [],
        courses: [],
        loading: false,
      });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Full name",
      render: (s) => `${s.firstName} ${s.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "studentId",
      label: <span className="text-nowrap">Student Id</span>,
      render: (s) => s.id || s.studentId || "N/A",
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (s) => formatDate(s.createdAt || s.created_at),
    },
    {
      key: "updatedAt",
      label: "Updated at",
      render: (s) => formatDate(s.updatedAt || s.updated_at),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (s) => (
        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchStudentDetails(s.id)}
          >
            View
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setDeleteState({ id: s.id, open: true, reason: "" })}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  const filteredList = (list || []).filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
    const email = (s.email || "").toLowerCase();
    const idStr = String(s.id || s.studentId || "").toLowerCase();
    return name.includes(q) || email.includes(q) || idStr.includes(q);
  });

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
          <h5 className="card-title m-0 text-info">Students List</h5>
          <div className="d-flex align-items-center justify-content-end" style={{ minWidth: "260px" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredList}
            emptyMessage="No students found"
          />
        )}

        <DetailModal
          show={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={
            `${selectedStudent?.firstName ?? ""} ${selectedStudent?.lastName ?? ""
              }`.trim() || "Student"
          }
          loading={details.loading}
        >
          <DetailSection label="1. Achievements">
            <div className="mt-3">
              <h6 className="fw-semibold">1.1 Certificates</h6>
              {details.certificates.length > 0 ? (
                <div className="list-group">
                  {details.certificates.map((cert, idx) => (
                    <div key={idx} className="list-group-item">
                      <div>
                        <strong>
                          {cert.courseTitle ||
                            `Certificate ${cert.certificateId || idx + 1}`}
                        </strong>
                        {cert.uniqueCode && (
                          <div className="text-muted small">
                            Code: {cert.uniqueCode}
                          </div>
                        )}
                        {cert.issueDate && (
                          <div className="text-muted small">
                            Issued:{" "}
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No certificates earned yet.</p>
              )}
            </div>
            <div className="mt-3">
              <h6 className="fw-semibold">1.2 Badges</h6>
              {details.badges.length > 0 ? (
                <div className="list-group">
                  {details.badges.map((badge, idx) => (
                    <div key={idx} className="list-group-item">
                      <div className="d-flex align-items-center">
                        {badge.iconUrl && (
                          <img
                            src={badge.iconUrl}
                            alt={badge.name}
                            className="badge-icon"
                          />
                        )}
                        <div>
                          <strong>
                            {badge.name || `Badge ${badge.badgeId || idx + 1}`}
                          </strong>
                          {badge.description && (
                            <div className="text-muted small">
                              {badge.description}
                            </div>
                          )}
                          {badge.earnedAt && (
                            <div className="text-muted small">
                              Earned:{" "}
                              {new Date(badge.earnedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No badges earned yet.</p>
              )}
            </div>
          </DetailSection>
          <DetailSection label="2. Enrolled Courses">
            {details.enrollments.length > 0 ? (
              <div className="list-group mt-2">
                {details.enrollments.map((enrollment, idx) => {
                  const course = details.courses[idx];
                  return (
                    <ListGroupItem
                      key={enrollment.enrollmentId || idx}
                      title={
                        course?.title || `Course ID: ${enrollment.courseId}`
                      }
                      description={course?.description}
                      badge={enrollment.completionStatus || "In Progress"}
                      badgeVariant={
                        enrollment.completionStatus === "Completed"
                          ? "success"
                          : "warning"
                      }
                      extra={
                        enrollment.enrollmentDate && (
                          <span className="text-muted small ms-2">
                            Enrolled:{" "}
                            {new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString()}
                          </span>
                        )
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <p className="empty-state">No enrolled courses.</p>
            )}
          </DetailSection>
        </DetailModal>

        <Modal
          show={deleteState.open}
          onClose={() => setDeleteState({ id: null, open: false, reason: "" })}
          title="Delete Student"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              rows={3}
              value={deleteState.reason}
              onChange={(e) =>
                setDeleteState({ ...deleteState, reason: e.target.value })
              }
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteState({ id: null, open: false, reason: "" })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await apiClient.delete(`/students/${deleteState.id}`, {
                    data: { reason: deleteState.reason },
                  });
                  setDeleteState({ id: null, open: false, reason: "" });
                  refetch();
                  toast.add("Student deleted successfully");
                } catch (e) {
                  alert("Failed to delete");
                }
              }}
              disabled={!deleteState.reason.trim()}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function InstructorsTab() {
  const toast = useToast();
  const { data: list, loading, error, refetch } = useDataFetch("/instructors");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [details, setDetails] = useState({ courses: [], loading: false });
  const [deleteState, setDeleteState] = useState({
    id: null,
    open: false,
    reason: "",
  });
  const [search, setSearch] = useState("");

  const fetchInstructorDetails = async (instructorId) => {
    setDetails({ courses: [], loading: true });
    try {
      const instructorRes = await apiClient.get(`/instructors/${instructorId}`);
      const instructor = instructorRes.data;
      let courses = [];
      try {
        const coursesRes = await apiClient.get(
          `/courses/instructor/${instructorId}`
        );
        courses = coursesRes.data?.data || [];
      } catch (e) {
        console.error("Failed to load courses:", e);
      }
      setDetails({ courses, loading: false });
      setSelectedInstructor(instructor);
    } catch (e) {
      console.error(e);
      setDetails({ courses: [], loading: false });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (i) => `${i.firstName} ${i.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "instructorId",
      label: <span className="text-nowrap">Instructor Id</span>,
      render: (i) => i.id || i.instructorId || "N/A",
    },
    {
      key: "createdAt",
      label: "Create At",
      render: (i) => formatDate(i.createdAt || i.created_at),
    },
    {
      key: "updatedAt",
      label: "Update At",
      render: (i) => formatDate(i.updatedAt || i.updated_at),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (i) => (
        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchInstructorDetails(i.id)}
          >
            View
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setDeleteState({ id: i.id, open: true, reason: "" })}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredList = (list || []).filter((i) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = `${i.firstName || ""} ${i.lastName || ""}`.toLowerCase();
    const email = (i.email || "").toLowerCase();
    const idStr = String(i.id || i.instructorId || "").toLowerCase();
    return name.includes(q) || email.includes(q) || idStr.includes(q);
  });

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
          <h5 className="card-title m-0 text-info">Instructors List</h5>
          <div className="d-flex align-items-center justify-content-end" style={{ minWidth: "260px" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredList}
            emptyMessage="No instructors found"
          />
        )}

        <DetailModal
          show={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          title={
            `${selectedInstructor?.firstName ?? ""} ${selectedInstructor?.lastName ?? ""
              }`.trim() || "Instructor"
          }
          loading={details.loading}
        >
          <DetailSection label="1. Bio">
            <p className="form-control-plaintext">
              {selectedInstructor?.bio || "N/A"}
            </p>
          </DetailSection>
          <DetailSection label="2. Expertise">
            <p className="form-control-plaintext">
              {selectedInstructor?.expertise || "N/A"}
            </p>
          </DetailSection>
          <DetailSection label="3. Created Courses">
            {details.courses.length > 0 ? (
              <div className="list-group mt-2">
                {details.courses.map((course) => (
                  <ListGroupItem
                    key={course.courseId}
                    title={course.title}
                    description={course.description}
                    badge={course.status || "Draft"}
                    badgeVariant={
                      course.status === "Published" ? "success" : "secondary"
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">No courses created yet.</p>
            )}
          </DetailSection>
        </DetailModal>

        <Modal
          show={deleteState.open}
          onClose={() => setDeleteState({ id: null, open: false, reason: "" })}
          title="Delete Instructor"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              rows={3}
              value={deleteState.reason}
              onChange={(e) =>
                setDeleteState({ ...deleteState, reason: e.target.value })
              }
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteState({ id: null, open: false, reason: "" })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await apiClient.delete(`/instructors/${deleteState.id}`, {
                    data: { reason: deleteState.reason },
                  });
                  setDeleteState({ id: null, open: false, reason: "" });
                  refetch();
                  toast.add("Instructor deleted successfully");
                } catch (e) {
                  alert("Failed to delete");
                }
              }}
              disabled={!deleteState.reason.trim()}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function CoursesTab() {
  const toast = useToast();
  const { data: list, loading, error, refetch } = useDataFetch("/courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [details, setDetails] = useState({
    instructor: null,
    enrollments: [],
    category: null,
    loading: false,
  });
  const [editCourse, setEditCourse] = useState({
    open: false,
    course: null,
  }); // will be removed
  const [deleteCourse, setDeleteCourse] = useState({
    id: null,
    open: false,
    reason: "",
  });
  const [modules, setModules] = useState({
    open: false,
    list: [],
    loading: false,
  });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiClient.get("/categories");
        const categories =
          categoriesData.data?.data || categoriesData.data || [];
        console.log("Fetched categories:", categories);
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchCourseDetails = async (courseId) => {
    setDetails({
      instructor: null,
      enrollments: [],
      category: null,
      loading: true,
    });
    try {
      const courseRes = await apiClient.get(`/courses/${courseId}`);
      const course = courseRes.data?.data || courseRes.data;

      let instructor = null;
      if (course.instructorId) {
        try {
          const instructorRes = await apiClient.get(
            `/instructors/${course.instructorId}`
          );
          instructor = instructorRes.data;
        } catch (e) {
          console.error("Failed to load instructor:", e);
        }
      }

      let enrollments = [];
      try {
        const enrollmentRes = await apiClient.get(
          `/enrollments/course/${courseId}`
        );
        enrollments = enrollmentRes.data?.data || [];
      } catch (e) {
        console.error("Failed to load enrollments:", e);
      }

      // Find category information if course has categoryId
      let category = null;
      if (course.categoryId) {
        category = categories.find(
          (cat) =>
            cat.id === course.categoryId || cat.categoryId === course.categoryId
        );
        if (!category) {
          try {
            const categoryRes = await apiClient.get(
              `/categories/${course.categoryId}`
            );
            category = categoryRes.data?.data || categoryRes.data;
          } catch (e) {
            console.error("Failed to load category:", e);
          }
        }
      }

      setDetails({ instructor, enrollments, category, loading: false });
      setSelectedCourse(course);
    } catch (e) {
      console.error(e);
      setDetails({
        instructor: null,
        enrollments: [],
        category: null,
        loading: false,
      });
    }
  };

  const columns = [
    { key: "title", label: "Name" },
    {
      key: "courseId",
      label: <span className="text-nowrap">Course Id</span>,
      render: (c) => c.courseId || c.id || "N/A",
    },
    {
      key: "category",
      label: "Category",
      render: (c) => {
        if (!c.categoryId) return "N/A";
        const category = categories.find(
          (cat) => cat.id === c.categoryId || cat.categoryId === c.categoryId
        );
        return category ? category.name : c.categoryType || "N/A";
      },
    },
    { key: "status", label: "Status", render: (c) => c.status || "N/A" },
    { key: "duration", label: "Duration", render: (c) => c.duration || "N/A" },
    {
      key: "createdAt",
      label: "Created at",
      render: (c) => formatDate(c.createdAt),
    },
    // {
    //   key: "updatedAt",
    //   label: "Updated at",
    //   render: (c) => formatDate(c.updatedAt),
    // },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (c) => (
        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchCourseDetails(c.courseId)}
          >
            View
          </button>


          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() =>
              setDeleteCourse({ id: c.courseId || c.id, open: true, reason: "" })
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  const completedCount = details.enrollments.filter(
    (e) => e.completionStatus === "Completed"
  ).length;
  const enrolledCount = details.enrollments.length;

  const filteredList = (list || []).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const title = (c.title || "").toLowerCase();
    const idStr = String(c.courseId || c.id || "").toLowerCase();
    const categoryType = (c.categoryType || "").toLowerCase();
    return (
      title.includes(q) ||
      idStr.includes(q) ||
      categoryType.includes(q)
    );
  });

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
          <h5 className="card-title m-0 text-info">Courses List</h5>
          <div className="d-flex align-items-center justify-content-end" style={{ minWidth: "260px" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredList}
            emptyMessage="No courses found"
          />
        )}

        <DetailModal
          show={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse?.title || "Course"}
          loading={details.loading}
        >
          {/* --- CHANGE 1 --- */}
          <DetailSection label="1. Category">
            <p className="fs-5 fw-semibold mb-1"> {/* <-- MODIFIED */}
              {details.category
                ? details.category.name
                : selectedCourse?.categoryType || "N/A"}
            </p>
            {details.category && details.category.description && (
              <p className="text-muted mb-3"> {/* <-- MODIFIED */}
                {details.category.description}
              </p>
            )}
          </DetailSection>

          {/* --- CHANGE 2 --- */}
          <DetailSection label="2. Created By">
            <p className="fs-5 fw-semibold mb-3"> {/* <-- MODIFIED */}
              {details.instructor
                ? `${details.instructor.firstName} ${details.instructor.lastName}`
                : "N/A"}
            </p>
          </DetailSection>

          {/* --- CHANGE 3 --- */}
          <DetailSection label="3. Enroll">
            <p className="fs-5 fw-semibold mb-3"> {/* <-- MODIFIED */}
              {enrolledCount} {enrolledCount === 1 ? "person" : "people"}{" "}
              enrolled
            </p>
          </DetailSection>

          {/* --- CHANGE 4 (THEME COLOR) --- */}
          <DetailSection label="4. Modules">
            <div className="mt-2 mb-3"> {/* <-- Added mb-3 for spacing */}
              <button
                className="btn btn-info text-white view-modules-btn" /* <-- MODIFIED */
                onClick={async () => {
                  if (!selectedCourse) return;
                  setModules({ open: true, list: [], loading: true });
                  try {
                    const res = await apiClient.get(
                      `/course-modules/course/${selectedCourse.courseId || selectedCourse.id
                      }`
                    );
                    const data = res.data?.data || [];
                    setModules({ open: true, list: data, loading: false });
                  } catch (e) {
                    setModules({ open: true, list: [], loading: false });
                  }
                }}
              >
                View Modules
              </button>
            </div>
          </DetailSection>

          {/* --- CHANGE 5 --- */}
          <DetailSection label="5. Completion">
            <p className="fs-5 fw-semibold mb-3"> {/* <-- MODIFIED */}
              {completedCount} {completedCount === 1 ? "person" : "people"}{" "}
              completed
            </p>
          </DetailSection>
        </DetailModal>

        <Modal
          show={deleteCourse.open}
          onClose={() => setDeleteCourse({ id: null, open: false, reason: "" })}
          title="Delete Course"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              rows={3}
              value={deleteCourse.reason}
              onChange={(e) =>
                setDeleteCourse({ ...deleteCourse, reason: e.target.value })
              }
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteCourse({ id: null, open: false, reason: "" })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={!deleteCourse.reason.trim()}
              onClick={async () => {
                try {
                  await apiClient.delete(`/courses/${deleteCourse.id}`, {
                    data: { reason: deleteCourse.reason },
                  });
                  setDeleteCourse({ id: null, open: false, reason: "" });
                  refetch();
                  toast.add("Course deleted successfully");
                } catch (e) {
                  alert("Failed to delete course");
                }
              }}
            >
              Delete
            </button>
          </div>
        </Modal>

        {editCourse.open && editCourse.course && (
          <CourseModal
            course={editCourse.course}
            onClose={() => setEditCourse({ open: false, course: null })}
            onSuccess={async () => {
              setEditCourse({ open: false, course: null });
              await refetch();
              toast.add("Course updated successfully");
            }}
          />
        )}

        <Modal
          show={modules.open}
          onClose={() => setModules({ open: false, list: [], loading: false })}
          title="Modules"
        >
          <div className="modal-body">
            {modules.loading ? (
              <p>Loading modules...</p>
            ) : (
              <div>
                <h5 className="mb-3">Module Title</h5>
                <div className="module-list">
                  {modules.list.map((m, idx) => (
                    <div key={m.moduleId || idx} className="module-item">
                      {m.title}
                    </div>
                  ))}
                  {modules.list.length === 0 && (
                    <div className="text-center text-secondary py-3">
                      No modules available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setModules({ open: false, list: [], loading: false })
              }
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function EnrollmentTab() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAllEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all students
      const studentsRes = await apiClient.get("/students");
      const students = studentsRes.data || [];

      // Fetch enrollments for each student
      const enrollmentPromises = students.map(async (student) => {
        try {
          const enrollmentRes = await apiClient.get(
            `/enrollments/student/${student.id}`
          );
          const studentEnrollments = enrollmentRes.data?.data || [];

          // Fetch course details for each enrollment
          const enrollmentsWithDetails = await Promise.all(
            studentEnrollments.map(async (enrollment) => {
              try {
                const courseRes = await apiClient.get(
                  `/courses/${enrollment.courseId}`
                );
                const course = courseRes.data?.data || courseRes.data;
                return {
                  ...enrollment,
                  studentName: `${student.firstName} ${student.lastName}`,
                  courseName:
                    course?.title || `Course ID: ${enrollment.courseId}`,
                };
              } catch (e) {
                return {
                  ...enrollment,
                  studentName: `${student.firstName} ${student.lastName}`,
                  courseName: `Course ID: ${enrollment.courseId}`,
                };
              }
            })
          );
          return enrollmentsWithDetails;
        } catch (e) {
          return [];
        }
      });

      const allEnrollments = (await Promise.all(enrollmentPromises)).flat();
      setEnrollments(allEnrollments);
    } catch (e) {
      setError("Failed to load enrollments");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEnrollments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    { key: "studentName", label: "Student" },
    { key: "courseName", label: "Course Name" },
    {
      key: "enrollmentDate",
      label: "Enrolled Date",
      render: (e) => formatDate(e.enrollmentDate),
    },
    {
      key: "completionStatus",
      label: "Completion status",
      render: (e) => e.completionStatus || "N/A",
    },
  ];

  const filteredEnrollments = (enrollments || []).filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const student = (e.studentName || "").toLowerCase();
    const course = (e.courseName || "").toLowerCase();
    const status = (e.completionStatus || "").toLowerCase();
    return student.includes(q) || course.includes(q) || status.includes(q);
  });

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
          <h5 className="card-title m-0 text-info">Enrollment List</h5>
          <div className="d-flex align-items-center justify-content-end" style={{ minWidth: "260px" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading enrollments...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredEnrollments}
            emptyMessage="No enrollments found"
          />
        )}
      </div>
    </div>
  );
}
