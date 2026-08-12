/* eslint-disable no-undef */

import { useEffect, useRef, useState } from "react";
import { Container, Card, Form } from "react-bootstrap";
import "../../styles/registerStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { AddBtn } from "../customComponents/Addbtn";
import { getErrorMessage } from "../../utils/getErrorMessage";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const nameRegex = /^[A-Za-z][A-Za-z0-9_-]{3,23}$/;

const pwdRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const mailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function Registration() {
  const inputRef = useRef(null);
  const errorRef = useRef(null);

  const [user, setUser] = useState("");
  const [validName, setvalidName] = useState(false);
  const [userFocus, setuserFocus] = useState(false);

  const [mail, setmail] = useState("");
  const [validMail, setvalidMail] = useState(false);
  const [mailFocus, setmailFocus] = useState(false);

  const [pwd, setpwd] = useState("");
  const [validpwd, setvalidpwd] = useState(false);
  const [pwdFocus, setpwdFocus] = useState(false);

  const [matchpwd, setmatchpwd] = useState("");
  const [validmatchpwd, setvalidmatchpwd] = useState(false);
  const [matchpwdFocus, setmatchpwdFocus] = useState(false);

  // Doctor checkbox
  const [isDoctor, setIsDoctor] = useState(false);

  const [errormsg, seterrormsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const result = nameRegex.test(user);
    setvalidName(result);
  }, [user]);

  useEffect(() => {
    const result = mailRegex.test(mail);
    setvalidMail(result);
  }, [mail]);

  useEffect(() => {
    const result = pwdRegex.test(pwd);

    setvalidpwd(result);

    const match = matchpwd.length > 0 && pwd === matchpwd;

    setvalidmatchpwd(match);
  }, [pwd, matchpwd]);

  useEffect(() => {
    seterrormsg("");
  }, [user, mail, pwd, matchpwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = nameRegex.test(user);
    const isMailValid = mailRegex.test(mail);
    const isPasswordValid = pwdRegex.test(pwd);
    const isMatchValid =
      matchpwd.length > 0 && pwd === matchpwd;

    console.log({
      isNameValid,
      isMailValid,
      isPasswordValid,
      isMatchValid,
    });

    if (
      !isNameValid ||
      !isMailValid ||
      !isPasswordValid ||
      !isMatchValid
    ) {
      console.log("not valid");
      seterrormsg("Invalid Entry");
      return;
    }

    try {
      // Checkbox determines the role
      const role = isDoctor ? "doctor" : "user";

      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user,
          email: mail,
          password: pwd,
          role,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
      }

      const data = await response.json();

      console.log(data);

      setUser("");
      setmail("");
      setpwd("");
      setmatchpwd("");
      setIsDoctor(false);

      setSuccess(true);

      handleClick();
    } catch (error) {
      seterrormsg(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <Container className="d-flex flex-column w-100 align-items-center">
        <Card className="p-4 border border-0 w-75 mx-auto">
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name:</Form.Label>

              <Form.Control
                type="text"
                placeholder="Name"
                className={`form-control ${
                  user &&
                  (validName ? "is-valid" : "is-invalid")
                }`}
                ref={inputRef}
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                }}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setuserFocus(true)}
                onBlur={() => setuserFocus(false)}
              />

              <p
                id="uidnote"
                className={
                  userFocus && user && !validName
                    ? "instructions"
                    : "offscreen"
                }
              >
                Invalid User Name
              </p>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email:</Form.Label>

              <Form.Control
                type="email"
                placeholder="Email"
                className={`form-control ${
                  mail &&
                  (validMail ? "is-valid" : "is-invalid")
                }`}
                value={mail}
                onChange={(e) => setmail(e.target.value)}
                required
                aria-invalid={validMail ? "false" : "true"}
                aria-describedby="emailnote"
                onFocus={() => setmailFocus(true)}
                onBlur={() => setmailFocus(false)}
              />

              <p
                id="emailnote"
                className={
                  mailFocus && mail && !validMail
                    ? "instructions"
                    : "offscreen"
                }
              >
                Enter a valid email address.
              </p>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password:</Form.Label>

              <Form.Control
                type="password"
                placeholder="Password"
                className={`form-control ${
                  pwd &&
                  (validpwd ? "is-valid" : "is-invalid")
                }`}
                value={pwd}
                onChange={(e) => setpwd(e.target.value)}
                required
                aria-invalid={validpwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setpwdFocus(true)}
                onBlur={() => setpwdFocus(false)}
              />

              <p
                id="pwdnote"
                className={
                  pwdFocus && pwd && !validpwd
                    ? "instructions"
                    : "offscreen"
                }
              >
                Must include uppercase, lowercase, a number, and a
                special character.
              </p>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group
              className="mb-3"
              controlId="formConfirmPassword"
            >
              <Form.Label>Confirm Password:</Form.Label>

              <Form.Control
                type="password"
                placeholder="Confirm Password"
                className={`form-control ${
                  matchpwd &&
                  (validmatchpwd
                    ? "is-valid"
                    : "is-invalid")
                }`}
                value={matchpwd}
                onChange={(e) => setmatchpwd(e.target.value)}
                required
                aria-invalid={
                  validmatchpwd ? "false" : "true"
                }
                aria-describedby="confirmnote"
                onFocus={() => setmatchpwdFocus(true)}
                onBlur={() => setmatchpwdFocus(false)}
              />

              <p
                id="confirmnote"
                className={
                  matchpwdFocus &&
                  matchpwd &&
                  !validmatchpwd
                    ? "instructions"
                    : "offscreen"
                }
              >
                Must match the password you entered.
              </p>
            </Form.Group>

            {/* Doctor Checkbox */}
            <Form.Group
              className="mb-3"
              controlId="doctorCheckbox"
            >
              <Form.Check
                type="checkbox"
                label="Register as a doctor"
                checked={isDoctor}
                onChange={(e) =>
                  setIsDoctor(e.target.checked)
                }
              />
            </Form.Group>

            {/* Login Link */}
            <p className="mt-2">
              Already have an account?

              <Link
                className="ms-2 text-decoration-none text-info"
                to="/login"
              >
                login
              </Link>
            </p>

            {/* Register Button */}
            <AddBtn
              type="submit"
              className="ms-auto d-block"
            >
              Register
            </AddBtn>
          </Form>
        </Card>

        {/* Error Message */}
        <p
          ref={errorRef}
          className={
            errormsg ? "errmsg" : "offscreen"
          }
          aria-live="assertive"
        >
          {errormsg}
        </p>

        {/* Success Message */}
        {success && (
          <p className="success-msg">
            Registration successful
          </p>
        )}
      </Container>
    </>
  );
}