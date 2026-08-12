/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AddBtn } from "../components/customComponents/Addbtn";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { motion } from "framer-motion";
import logo from "../assets/medi3.png";

import "../pages/Login.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     Validation
  ========================= */

  const mailRegex =
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  const pwdRegex =
    "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!RegExp(mailRegex).test(email)) {
      newErrors.email = "Email is invalid";
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

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          form: data.msg || "Invalid email or password",
        });

        return;
      }

      // Store token
      localStorage.setItem("token", data.token);

      window.dispatchEvent(new Event("storage"));

      navigate("/home");
    } catch (error) {
      console.error(error.message);

      setErrors({
        form: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="login-left">

        <div className="login-wrapper">

          {/* =========================
              HEADER
          ========================= */}

          <motion.div
            className="login-header"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={logo}
              alt="Medifind Logo"
              className="login-logo"
            />

            <h1 className="login-title">
              Welcome Back
            </h1>

            <p className="login-subtitle">
              Sign in to continue your humanitarian journey
            </p>
          </motion.div>

          {/* =========================
              CARD
          ========================= */}

          <motion.div
            className="login-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
          >

            {/* =================================================
                IMPORTANT:

                Everything inside this wrapper can scroll.
                The button is INSIDE it.
            ================================================= */}

            <div className="login-form-scroll">

              <Form
                onSubmit={handleSubmit}
                className="login-form"
              >

                {/* =========================
                    EMAIL
                ========================= */}

                <div className="login-field">

                  <label
                    htmlFor="login-email"
                    className="login-label"
                  >
                    Email
                  </label>

                  <div className="login-input-wrapper">

                    <FaUser className="login-input-icon" />

                    <Form.Control
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      isInvalid={!!errors.email}
                      className="login-input"
                    />

                  </div>

                  {errors.email && (
                    <div className="login-error">
                      {errors.email}
                    </div>
                  )}

                </div>

                {/* =========================
                    PASSWORD
                ========================= */}

                <div className="login-field">

                  <label
                    htmlFor="login-password"
                    className="login-label"
                  >
                    Password
                  </label>

                  <div className="login-input-wrapper">

                    <FaLock className="login-input-icon" />

                    <Form.Control
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      isInvalid={!!errors.password}
                      className="login-input"
                    />

                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                  {errors.password && (
                    <div className="login-error">
                      {errors.password}
                    </div>
                  )}

                </div>

                {/* =========================
                    REMEMBER / FORGOT
                ========================= */}

                <div className="login-options">

                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    className="login-remember"
                  />

                  <Link
                    to="/forgot-password"
                    className="login-forgot"
                  >
                    Forgot Password?
                  </Link>

                </div>

                {/* =========================
                    FORM ERROR
                ========================= */}

                {errors.form && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="login-form-error"
                  >
                    {errors.form}
                  </motion.div>
                )}

                {/* =========================
                    LOGIN BUTTON

                    IMPORTANT:
                    It is inside the scroll area.
                ========================= */}

                <motion.div
                  className="login-submit-wrapper"
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                >

                  <AddBtn
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Signing in..."
                      : "Sign In"}
                  </AddBtn>

                </motion.div>

                {/* =========================
                    REGISTER
                ========================= */}

                <div className="login-register">

                  <span>
                    Don't have an account?{" "}
                  </span>

                  <Link to="/">
                    Register now
                  </Link>

                </div>

              </Form>

            </div>

          </motion.div>

        </div>

      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="login-right">

        {/* Decorative shapes */}

        <div
          className="
            login-decoration
            login-decoration-1
          "
        />

        <div
          className="
            login-decoration
            login-decoration-2
          "
        />

        <div
          className="
            login-decoration
            login-decoration-3
          "
        />

        {/* Content */}

        <motion.div
          className="login-right-content"
          initial={{
            opacity: 0,
            x: 30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
        >

          <h2 className="login-right-title">
            Care Starts With You
          </h2>

          <p className="login-right-text">
            Connect with people, medicines and
            healthcare services through Medifind.
          </p>

        </motion.div>

      </div>

    </div>
  );
}