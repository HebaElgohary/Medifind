import { Navbar, Container, Nav, Spinner } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";

import logo from "../../assets/medi3.png";
import { useFetch } from "../../customHooks/useFetch";
import { useDecoded } from "../../customHooks/useDecode";

import "../../styles/navstyle.css";
import "../../styles/sidebar.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const NavBar = () => {
  const navigate = useNavigate();

  const { decodedToken, isDecoding } = useDecoded();

  const loggedInUserId = decodedToken?.id;

  const { data: user, isLoading } = useFetch(
    loggedInUserId
      ? `${BASE_URL}/user/${loggedInUserId}`
      : null
  );

  const userData =
    Array.isArray(user) && user.length > 0
      ? user[0]
      : user;

  const userInitial = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));

    navigate("/login", { replace: true });
  };

  if (isDecoding) {
    return (
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              width: "100px",
              height: "70px",
            }}
          >
            <img src={logo} alt="Logo" className="w-100" />
          </Navbar.Brand>

          <Spinner animation="border" size="sm" />
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar bg="" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            width: "100px",
            height: "70px",
          }}
        >
          <img src={logo} alt="Logo" className="w-100" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="mt-3 mt-lg-0"
        >
          {/* USER NAVBAR */}
          {decodedToken?.role?.toLowerCase() === "user" && (
            <Nav
              className="
                sidebar
                mx-lg-auto
                justify-lg-content-center
                align-items-lg-center
                align-items-start
              "
            >
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/AddMedicine"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Add Medicine
              </NavLink>

              <NavLink
                to="/RequestMedicine"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Request Medicine
              </NavLink>

              <NavLink
                to="/need"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/donate"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Donation
              </NavLink>
            </Nav>
          )}

          {/* DOCTOR NAVBAR */}
          {decodedToken?.role?.toLowerCase() === "doctor" && (
            <Nav className="ms-auto review">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/RequestsReview"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Requests
              </NavLink>

              <NavLink
                to="/offersReview"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                Offers
              </NavLink>
            </Nav>
          )}

          {/* USER ICON + LOGOUT */}
          <div className="d-flex align-items-center ms-lg-auto">
            <div
              className="
                user-icon
                ms-lg-3
                d-flex
                align-items-center
                justify-content-center
              "
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : userData ? (
                userInitial
              ) : (
                "?"
              )}
            </div>

            <div className="logout">
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};