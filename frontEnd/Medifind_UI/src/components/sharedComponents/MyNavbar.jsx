/* eslint-disable no-undef */

import { Navbar, Container, Nav, Spinner } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../../assets/medi3.png";
import { useFetch } from "../../customHooks/useFetch";
import { useDecoded } from "../../customHooks/useDecode";
import "../../styles/navstyle.css";
import "../../styles/sidebar.css";
import { BASE_URL } from "../../config.js";
import { useEffect } from "react";

export const NavBar = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const decodedToken = useDecoded();
  const loggedInUserId = decodedToken?.id;
  console.log(loggedInUserId);
  // Only fetch user data if we have a user ID
  const { data: user, isLoading } = useFetch(loggedInUserId ? `${baseUrl}/user/${loggedInUserId}` : null);
  
  // Extract user data - handle both array and object responses
  const userData = Array.isArray(user) && user.length > 0 ? user[0] : user;
  console.log('User data:', userData);
  
  // Get the first character of the user's name if available
  const userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : '?';
  console.log('User initial:', userInitial);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    
  }, [userInitial]);

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          
          className=""
          style={{ cursor: "pointer", width: "100px", height: "70px" }}
        >
          <img src={logo} alt="Logo" className="w-100  " />
          
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className=" mt-3 mt-lg-0" >
          {decodedToken?.role === 'user' && (
            <Nav className="sidebar mx-lg-auto  justify-lg-content-center align-items-lg-center align-items-start">   
              <NavLink to="/home" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Home
              </NavLink>
              {/* <NavLink to="/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Profile
              </NavLink> */}
              <NavLink to="/AddMedicine" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Add Medicine
              </NavLink>
              <NavLink to="/RequestMedicine" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Request Medicine
              </NavLink>
              <NavLink to="/need" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Orders
              </NavLink>
              <NavLink to="/donate" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Donation
              </NavLink>
            </Nav>
          )}

          {decodedToken?.role === 'doctor' && (
            <Nav className="ms-auto review">
              <NavLink to="/home" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Home
              </NavLink>
              <NavLink to="/RequestsReview" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Requests
              </NavLink>
              <NavLink to="/OffersReview" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Offers
              </NavLink>
            </Nav>
          )}

          <div className="d-flex align-items-center   ms-lg-auto">
              {/* User Icon */}
              <div
                className="user-icon  ms-lg-3 d-flex align-items-center justify-content-center "
                onClick={() => navigate("/profile")}
              >
                {isLoading ? <Spinner animation="border" size="sm" /> : userData ? userInitial : '?'}
              </div>

              {/* Logout Button */}
              <div className="logout">
                <button onClick={handleLogout}>Logout</button>
              </div>
          </div>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
