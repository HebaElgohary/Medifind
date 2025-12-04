/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import { Container, Card, Form } from "react-bootstrap";
import "../../styles/registerStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { AddBtn } from "../customComponents/Addbtn";
import { BASE_URL } from "../../config";



const nameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function Registration() {
  const inputRef = useRef(null); // for focus on name
  const errorRef = useRef(null);
  const baseUrl = BASE_URL;
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

  const [errormsg, seterrormsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const result = nameRegex.test(user); 
    console.log(result);
    console.log(user);
    setvalidName(result);
  }, [user]);

  useEffect(() => {
    const result = mailRegex.test(mail); 
     console.log(result);
     console.log(mail);
     setvalidMail(result);
  }, [mail]);

  useEffect(() => {
    const result = pwdRegex.test(pwd); 
     console.log(result);
     console.log(pwd);
     setvalidpwd(result);
    const match = pwd === matchpwd; 
    setvalidmatchpwd(match);
  }, [pwd, matchpwd]);

 useEffect(() => {
  seterrormsg("");
 },[user,mail,pwd,matchpwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validMail || !validpwd || !validmatchpwd) {
      console.log("not valid");
        seterrormsg("Invalid Entry");
      return;
    }

    try {
    const  role= user==='ahmed'?'doctor':'user'
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user, email: mail, password: pwd,role }),
      });
      if (!response.ok){
         throw new Error( "Something went wrong!");
      }

      const data = await response.json();
      console.log(data);
      setUser('')
      setSuccess(true);
      handleClick();
    } catch (error) {
      seterrormsg(error.message);
    }
  };

  return (
    <>
    <Container className="d-flex w-100 align-items-center">
    <p ref={errorRef} className={errormsg?"errmsg":'offscreen'} aria-live="assertive"> {errormsg}</p>
    {success && <p className="success-msg">{success}</p>}
      <Card className="p-4 border border-0 w-75 mx-auto">
        {/* <h3 className="text-center mb-4">Registration</h3> */}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              className={`form-control ${user && (validName ? 'is-valid' : 'is-invalid')}`}
              ref={inputRef}
              onChange={(e) => {
                setUser(e.target.value)}}
              required
                aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setuserFocus(true)}
              onBlur={() => setuserFocus(false)}
            />
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"/*"text-danger" : "d-none"*/}>Invalid User Name</p>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              className={`form-control ${mail && (validMail ? 'is-valid' : 'is-invalid')}`}
              onChange={(e) => setmail(e.target.value)}
              required
              aria-invalid={validMail ? "false" : "true"}
             aria-describedby="emailnote"
              onFocus={() => setmailFocus(true)}
              onBlur={() => setmailFocus(false)}
            />
            <p id="emailnote"  className={mailFocus && mail && !validMail ? "instructions" : "offscreen"/*"text-danger" : "d-none"*/}>Enter a valid email address.</p>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              className={`form-control ${pwd && (validpwd ? 'is-valid' : 'is-invalid')}`}
              onChange={(e) => setpwd(e.target.value)}
              required
                  aria-invalid={validpwd ? "false" : "true"}
            aria-describedby="pwdnote"
              onFocus={() => setpwdFocus(true)}
              onBlur={() => setpwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && pwd && !validpwd ? "instructions" : "offscreen"/*"text-danger" : "d-none"*/}>Must include uppercase, lowercase, a number, and a special character.</p>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className={`form-control ${matchpwd && (validmatchpwd ? 'is-valid' : 'is-invalid')}`}
              onChange={(e) => setmatchpwd(e.target.value)}
              required
               aria-invalid={validmatchpwd ? "false" : "true"}
             aria-describedby="confirmnote"
              onFocus={() => setmatchpwdFocus(true)}
              onBlur={() => setmatchpwdFocus(false)}
            />
            <p id="confirmnote" className={matchpwdFocus && matchpwd && !validmatchpwd ? "instructions" : "offscreen"/*"text-danger" : "d-none"*/}>Must match the password you entered.</p>
          </Form.Group>
          <p className="mt-2">
            Already have an account? 
            <Link className="ms-2 text-decoration-none text-info" to="/login" >login</Link>
          </p>
          
          <AddBtn type="submit" className="ms-auto d-block">Register</AddBtn>
        </Form>
      </Card>
    </Container>
    </>
  );
}




























// import {useEffect,useRef,useState} from "react";
// import { Container, Card, Form  } from "react-bootstrap";

// import{faCheck,faTimes,faInfoCircle} from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import "../../styles/registerStyle.css";
// import { Link, useNavigate } from "react-router-dom";
// import { AddBtn } from "../customComponents/Addbtn";



// const nameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
// const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// export function Registration() {

//   const inputRef = useRef(null);   // for focus on name
//   const errorRef = useRef(null);


// const[user,setUser] = useState('') ; 
// const[validName,setvalidName] = useState(false) ; 
// const[userFocus,setuserFocus] = useState(false) ; 


// const[mail,setmail] = useState('') ; 
// const[validMail,setvalidMail] = useState(false) ; 
// const[mailFocus,setmailFocus] = useState(false) ; 


// const[pwd,setpwd] = useState('') ; 
// const[validpwd,setvalidpwd] = useState(false) ; 
// const[pwdFocus,setpwdFocus] = useState(false) ; 


// const[matchpwd,setmatchpwd] = useState('') ; 
// const[validmatchpwd,setvalidmatchpwd] = useState(false) ; 
// const[matchpwdFocus,setmatchpwdFocus] = useState(false) ; 

// const[errormsg,seterrormsg] = useState('') ;
// const[success,setSuccess] = useState(false) ;


// const navigate=useNavigate();
  
// const handleClick=()=>{
//   navigate("/login");
// }

// useEffect(() => {
//   if (inputRef.current) {
//     inputRef.current.focus();
//   }
// }, []);

  
// useEffect(() => {
//   const result = nameRegex.test(user); 
//   console.log(result);
//   console.log(user);
//   setvalidName(result);
// },[user]);

// useEffect(() => {
//   const result = mailRegex.test(mail); 
//   console.log(result);
//   console.log(mail);
//   setvalidMail(result);
// },[mail]);
  
  
// useEffect(() => {
//   const result = pwdRegex.test(pwd); 
//   console.log(result);
//   console.log(pwd);
//   setvalidpwd(result);
//   const match = pwd === matchpwd; 
//   setvalidmatchpwd(match);
// },[pwd,matchpwd]);
  


// useEffect(() => {
//   seterrormsg("");
// },[user,mail,pwd,matchpwd]);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!validName || !validMail || !validpwd || !validmatchpwd) {
//     console.log(' not valid')
//     seterrormsg("Invalid Entry");
//     return;
//   }

//   try {
//     const response = await fetch("https://medifind-production.up.railway.app/register", {  // Add API endpoint here
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: user,
//         email: mail,
//         password: pwd,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(data.message || "Something went wrong!");
//     }

//     const data = await response.json();
//     console.log(data)
//     setSuccess(true);
//     handleClick();
 
    
// } catch (error) {
//     seterrormsg(error.message);
// }

// }

//   return (
//     <>
//         <Container className="d-flex  w-100  align-items-center  " >
//           <p ref={errorRef} className={errormsg?"errmsg":'offscreen'} aria-live="assertive"> {errormsg}</p>
//           {success && <p className="success-msg">{success}</p>}

//       <Card   className="p-4 border border-0 w-75 mx-auto  ">
//         {/* <h3 className="text-center mb-4">Registration</h3> */}

//         <Form onSubmit={handleSubmit}>
//            <Form.Group className="mb-3" controlId="formName">
//             <Form.Label > Name :
//                {/* <span className={validName ? "valid" : "hide"}>
//                 <FontAwesomeIcon icon={faCheck} /></span> 
//                 <span className={validName || !user ? "hide" : "invalid"}><FontAwesomeIcon icon={faTimes} />
//                 </span>  */}
//                 </Form.Label>
//             <Form.Control type="text"
//              placeholder=" name" 
//              className="form-control"
//               ref={inputRef}
//               onChange={(e) => setUser(e.target.value)}
//               required
//               aria-invalid={validName ? "false" : "true"}
//               aria-describedby="uidnote"
//               onFocus={() => setuserFocus(true)}
//               onBlur={() => setuserFocus(false)}
//               />

//               <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
//                 {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
//                  Invalid User Name</p>
//               </Form.Group>

//           <Form.Group className="mb-3" controlId="formEmail">
//             <Form.Label  > Email:
//               {/* <span className={validMail ? "valid" : "hide"}>
//                 <FontAwesomeIcon icon={faCheck} /></span>
//               <span className={validMail || !mail ? "hide" : "invalid"}>
//                 <FontAwesomeIcon icon={faTimes} /></span> */}
//             </Form.Label>
//             <Form.Control
//              type="email"
//              placeholder=" email" 
//              className="form-control"
//              onChange={(e) => setmail(e.target.value)}
//              required
//              aria-invalid={validMail ? "false" : "true"}
//              aria-describedby="emailnote"
//              onFocus={() => setmailFocus(true)}
//              onBlur={() => setmailFocus(false)}
//              />

//              <p id="emailnote" className={mailFocus && mail && !validMail ? "instructions" : "offscreen"}>
//                <FontAwesomeIcon icon={faInfoCircle} />  
//                Enter a valid email address.</p>

//              </Form.Group>

//           <Form.Group className="mb-3" controlId="formPassword">
//             <Form.Label> Password:
//               {/* <span className={validpwd ? "valid" : "hide"}>
//                 <FontAwesomeIcon icon={faCheck} /></span>
//               <span className={validpwd || !pwd ? "hide" : "invalid"}>
//                 <FontAwesomeIcon icon={faTimes} /></span> */}
//             </Form.Label>
//             <Form.Control 
//             type="password" 
//             placeholder=" Password" 
//             className="form-control"
//             onChange={(e) => setpwd(e.target.value)}
//             required
//             aria-invalid={validpwd ? "false" : "true"}
//             aria-describedby="pwdnote"
//             onFocus={() => setpwdFocus(true)} 
//             onBlur={() => setpwdFocus(false)}
//              />
//             <p id="pwdnote" className={pwdFocus && pwd && !validpwd ? "instructions" : "offscreen"}>
//               <FontAwesomeIcon icon={faInfoCircle} />
//               Must include uppercase and lowercase letters, a number and a special character.
//             </p>
//             </Form.Group>

//           <Form.Group className="mb-3" controlId="formConfirmPassword">
//             <Form.Label>Confirm  password:
//               {/* <span className={validmatchpwd && matchpwd ? "valid" : "hide"}>
//                 <FontAwesomeIcon icon={faCheck} /></span>
//                 <span className={validmatchpwd || !matchpwd ? "hide" : "invalid"}>
//                   <FontAwesomeIcon icon={faTimes} /></span> */}
//                             </Form.Label>
//             <Form.Control
//              type="password" 
//              placeholder=" Confirm Password" 
//              className="form-control" 
//              onChange={(e) => setmatchpwd(e.target.value)}
//              required
//              aria-invalid={validmatchpwd ? "false" : "true"}
//              aria-describedby="confirmnote"
//              onFocus={() => setmatchpwdFocus(true)}
//              onBlur={() => setmatchpwdFocus(false)}
//              />
            
//              <p id="confirmnote" className={matchpwdFocus && matchpwd && !validmatchpwd ? "instructions" : "offscreen"}>
//                <FontAwesomeIcon icon={faInfoCircle} />
//                 Must match the password you entered.
//              </p>
//              </Form.Group>

          
            
          
//           <p className="mt-2">
//             Already have an account? 
//             <Link className="ms-2 text-decoration-none text-info" to="/login" >login</Link>
//           </p>
//           <AddBtn className="ms-auto d-block" >Register</AddBtn>
//         </Form>
//       </Card>
//     </Container>
//     </>
//   )
// }
