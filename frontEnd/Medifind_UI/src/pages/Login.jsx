/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AddBtn } from "../components/customComponents/Addbtn";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHandHoldingMedical,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/medi3.png";
const BASE_URL  = import.meta.env.VITE_BASE_URL;
// Environment variables in React are accessed through process.env
export function Login() {
  const baseUrl = BASE_URL;
  const mailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  const pwdRegex =
    "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
  
  const navigate = useNavigate();

  const goToHome = () => navigate("/home");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!RegExp(mailRegex).test(email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!RegExp(pwdRegex).test(password)) {
      newErrors.password =
        "Password must be at least 8 characters, including a letter, a number, and a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/login`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setErrors({ form: errorData.message || "Invalid email or password" });
          throw new Error("Something went wrong!");
        }


        await response.json();
        const token = response.headers.get('x-auth-token');
        
        // Store token and trigger storage event
        localStorage.setItem('token', token);
        window.dispatchEvent(new Event('storage'));

        // Navigate after a small delay to ensure state updates
        setTimeout(() => {
          navigate("/home");
        }, 100);

      } catch (error) {
        console.error(error.message);

      } finally {
        setIsLoading(false);
      }
    }
  };

  return (

    <Container fluid className="min-vh-100">
      <Row className="min-vh-100">
        {/* Left side - Login Form */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center p-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-100"
            style={{ maxWidth: "450px" }}
          >
            <div className="text-center mb-4">
              <img
                src={logo}
                alt="Medifind Logo"
                style={{ width: "180px", marginBottom: "1rem" }}
              />
              <h2
                style={{
                  color: "#01b3bd",
                  fontSize: "2rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Welcome Back
              </h2>
              <p style={{ color: "#666" }}>
                Sign in to continue your humanitarian journey
              </p>
            </div>

        <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <div className="position-relative">
                  <FaUser
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#01b3bd",
                    }}
                  />
            <Form.Control
              type="email"
                    placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
                    style={{
                      height: "50px",
                      paddingLeft: "45px",
                      borderRadius: "10px",
                      border: "2px solid #e0e0e0",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
          </Form.Group>

              <Form.Group className="mb-4">
                <div className="position-relative">
                  <FaLock
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#01b3bd",
                    }}
                  />
            <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
                    style={{
                      height: "50px",
                      paddingLeft: "45px",
                      borderRadius: "10px",
                      border: "2px solid #e0e0e0",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#01b3bd",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
          </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  style={{ color: "#666" }}
                />
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#01b3bd",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AddBtn
                  type="submit"
                  className="w-100"
                  style={{
                    backgroundColor: "#01b3bd",
                    border: "none",
                    height: "50px",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 6px rgba(30, 150, 148, 0.2)",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </AddBtn>
              </motion.div>

              <div className="text-center mt-4">
                <span style={{ color: "#666" }}> Don't have an account? </span>
                <Link
                  to="/"
                  style={{
                    color: "#01b3bd",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Register now
                </Link>
              </div>
            </Form>

            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert alert-danger mt-4"
              >
                {errors.form}
              </motion.div>
            )}
          </motion.div>
        </Col>

        {/* Right side - Image and Content */}
        <Col
          md={6}
          className="d-none d-md-block position-relative"
          style={{
            background: "linear-gradient(135deg, #01b3bd 0%, #8B4C8C 100%)",
            overflow: "hidden",
          }}
        >
          {/* Animated circles in background */}
          <div className="animated-background">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="floating-circle"
                style={{
                  position: "absolute",
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Main content container */}
          <div className="position-relative h-100 d-flex flex-column justify-content-center align-items-center text-white px-4">
            {/* Top decorative icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              {/* <FaHandHoldingMedical size={60} color="white" /> */}
            </motion.div>

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-5"
              style={{
                width: "80%",
                maxWidth: "500px",
                position: "relative",
              }}
            >
              {/*  */}
            </motion.div>


            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-center"
              style={{ maxWidth: "80%" }}
            >
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  background: "linear-gradient(45deg, #ffffff, #e0e0e0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Join the Fight
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  lineHeight: "1.6",
                  opacity: 0.9,
                  marginBottom: "2rem",
                }}
              >
                Join our community of healthcare heroes making a difference.
                Together, we can ensure that no medicine goes to waste and every
                person gets the care they deserve
              </p>

              {/* Stats section */}
              <div className="d-flex justify-content-center gap-5 mb-4 mt-5">
                <div className="text-center">
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                    }}
                  >
                    <FaHandHoldingMedical style={{ marginRight: "8px" }} />
                    Donate
                  </div>
                  <div style={{ color: "#eee", fontSize: "0.9rem" }}>
                    Share unused medicine
                  </div>
                </div>
                <div className="text-center">
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                    }}
                  >
                    <FaHeart style={{ marginRight: "8px" }} />
                    Help
                  </div>
                  <div style={{ color: "#eee", fontSize: "0.9rem" }}>
                    Support those in need
                  </div>
      </div>
    </div>
            </motion.div>

            {/* Bottom decoration */}
            <motion.div
              className="mt-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* <FaHeart size={30} color="#ff6b6b" /> */}
            </motion.div>
          </div>
        </Col>
      </Row>

      <style>{`
        .form-control:focus {
          border-color: #01b3bd;
          box-shadow: 0 0 0 0.2rem rgba(30, 150, 148, 0.25);
        }
        
        .animated-background {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .floating-circle {
          filter: blur(20px);
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            background: linear-gradient(135deg, #01b3bd 0%, #8B4C8C 100%);
          }
          
          .col-md-6:first-child {
            background: white;
            border-radius: 20px;
            margin: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </Container>
  );
}
