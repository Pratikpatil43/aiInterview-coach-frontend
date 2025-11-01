import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import "bootstrap/dist/css/bootstrap.min.css";
import './Session.css'

const CreateSessionButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Fetch sessions
  const getSession = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/v1/session/getMySession",
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  // ✅ Create session
  const createSessionApi = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/v1/session/createSession",
      form,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const createMutation = useMutation({
    mutationFn: createSessionApi,
    onSuccess: () => {
      toast.success("Session created successfully ✅");
      queryClient.invalidateQueries(["session"]);
      setShowModal(false);
      setForm({ role: "", experience: "", topicsToFocus: "" });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create session ❌"),
  });

  // ✅ Delete session
  const deleteSessionApi = async (id) => {
    const res = await axios.delete(
      `http://localhost:5000/api/v1/session/deleteMySession/${id}`,
      { withCredentials: true }
    );
    return res.data;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteSessionApi,
    onSuccess: () => {
      toast.success("Session deleted successfully ✅");
      queryClient.invalidateQueries(["session"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete session ❌"),
  });

  const navigateSession = (id) => {
    navigate(`/session/${id}`);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center text-center py-5"
      style={{
        background: "linear-gradient(135deg, #0a0f24, #101c3c)",
        color: "#fff",
      }}
    >
      <h1 className="fw-bold mb-4">Manage Your AI Interview Sessions</h1>
      <p className="text-secondary mb-4">
        Click below to start a new interview session.
      </p>

      {/* ✅ Create Session Button */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-lg rounded-pill fw-semibold shadow-lg px-5 py-3 mt-3"
        style={{
          background: "linear-gradient(135deg, #00d4ff, #007bff, #00ffa3)",
          border: "none",
          color: "#fff",
          letterSpacing: "0.5px",
          fontSize: "1.1rem",
          boxShadow: "0 0 20px rgba(0,212,255,0.3)",
        }}
      >
        + Create Session
      </motion.button>

      {/* ✅ Session Cards */}
      <div className="container mt-5">
        {isLoading ? (
          <h3 className="text-light">Loading...</h3>
        ) : data?.session?.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {data.session.map((item, index) => (
              <motion.div
                key={index}
                onClick={() => navigateSession(item._id)}
                whileHover={{ scale: 1.03 }}
                className="position-relative card p-4 text-start"
                style={{
                  width: "300px",
                  minHeight: "250px",
                  cursor: "pointer",
                  background:
                    "linear-gradient(145deg, rgba(43,58,107,0.9), rgba(31,42,77,0.95))",
                  border: "1px solid rgba(0,212,255,0.4)",
                  borderRadius: "1.5rem",
                  boxShadow:
                    "0 0 20px rgba(0,212,255,0.15), inset 0 0 8px rgba(255,255,255,0.05)",
                  color: "#fff",
                }}
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(item._id);
                  }}
                  className="position-absolute top-0 end-0 m-3 p-2 bg-transparent border-0"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <span className="text-secondary small">...</span>
                  ) : (
                    <RiDeleteBin5Line
                      size={22}
                      className="text-danger opacity-75"
                    />
                  )}
                </button>

                <h5 className="fw-bold mb-2 text-info">{item.role}</h5>
                <p className="text-secondary small mb-1">
                  Experience: {item.experience} yrs
                </p>
                <p className="small">
                  <span className="text-light fw-semibold">Topics:</span>{" "}
                  {item.topicsToFocus}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-secondary mt-4">No sessions found.</p>
        )}
      </div>

      {/* ✅ Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(12px)",
              zIndex: 9999,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.35 }}
              className="p-4 p-md-5 rounded-5 shadow-lg position-relative"
              style={{
                width: "90%",
                maxWidth: "500px",
                background:
                  "linear-gradient(145deg, rgba(15,25,45,0.9), rgba(25,45,85,0.95))",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#fff",
              }}
            >
              {/* Close Button */}
              <button
                className="btn position-absolute top-0 end-0 mt-3 me-3 p-2 bg-transparent border-0 text-light fs-4"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <h2
                  className="fw-bold mb-2"
                  style={{
                    background:
                      "linear-gradient(90deg, #00d4ff, #00ffa3, #007bff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Create New Session
                </h2>
                <p className="text-secondary small">
                  Set your role, experience, and topics to focus on.
                </p>
              </div>

              {/* ✅ Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light fw-semibold">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="form-control bg-transparent text-light rounded-4 py-3 px-3"
                    style={{ border: "1px solid rgba(0,212,255,0.4)" }}
                    placeholder="e.g. Frontend Developer"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light fw-semibold">
                    Experience (in years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="form-control bg-transparent text-light rounded-4 py-3 px-3"
                    style={{ border: "1px solid rgba(0,212,255,0.4)" }}
                    placeholder="e.g. 2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light fw-semibold">
                    Topics to Focus
                  </label>
                  <textarea
                    name="topicsToFocus"
                    value={form.topicsToFocus}
                    onChange={handleChange}
                    className="form-control bg-transparent text-light rounded-4 py-3 px-3"
                    style={{ border: "1px solid rgba(0,212,255,0.4)" }}
                    placeholder="e.g. React Hooks, APIs, Data Structures"
                    rows="3"
                    required
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline-light rounded-pill px-4 py-2"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={createMutation.isPending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn rounded-pill px-4 py-2 fw-semibold"
                    style={{
                      background:
                        "linear-gradient(90deg, #00d4ff, #00ffa3, #007bff)",
                      border: "none",
                      color: "#000",
                      fontWeight: "600",
                    }}
                  >
                    {createMutation.isPending
                      ? "Creating..."
                      : "Create Session"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateSessionButton;
