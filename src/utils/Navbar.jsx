import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isAuthenitcate } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const LoginRoute = () => navigate("/login");
  const RegisterRoute = () => navigate("/register");

  return (
    <nav
      className="navbar navbar-expand-lg py-3 px-4 shadow-lg fixed-top"
      style={{
        background:
          "linear-gradient(90deg, rgba(10,20,40,0.95) 0%, rgba(15,30,60,0.95) 50%, rgba(10,20,40,0.95) 100%)",
        borderBottom: "1px solid rgba(0,255,255,0.2)",
        backdropFilter: "blur(15px)",
        zIndex: 1050,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="fw-bold m-0"
          style={{
            color: "#fff",
            fontSize: "1.8rem",
            letterSpacing: "1px",
            cursor: "pointer",
            textShadow: "0 0 10px rgba(0,255,255,0.3)",
          }}
        >
          Ai<span style={{ color: "#00d0ff" }}>Prep.</span>
        </motion.h1>

        <div className="d-flex align-items-center gap-3">
          {isAuthenitcate ? (
            <Profile />
          ) : (
            <>
              <Button
                onClick={LoginRoute}
                className="fw-semibold rounded-pill px-4 py-2"
                style={{
                  background: "linear-gradient(90deg, #007bff, #00d0ff)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 0 12px rgba(0,212,255,0.4)",
                  transition: "0.3s ease",
                }}
              >
                Login
              </Button>

              <Button
                onClick={RegisterRoute}
                className="fw-semibold rounded-pill px-4 py-2"
                style={{
                  background: "transparent",
                  border: "2px solid #00d0ff",
                  color: "#00d0ff",
                  transition: "0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#00d0ff";
                  e.target.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#00d0ff";
                }}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
