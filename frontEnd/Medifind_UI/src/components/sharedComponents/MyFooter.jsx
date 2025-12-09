import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (

    <footer className=" mt-auto  " style={{ backgroundColor: "#1E252B", padding: "20px 0" }}>

      <Container>
        <Row className="text-white text-center text-md-start position-relative">
          {/* Brand Name */}
          <Col
            className="d-flex justify-content-center justify-content-md-start align-items-center mb-3 mb-md-0"
            md={3}
            style={{ paddingRight: "20px", position: "relative" }}
          >
            <h3 className="text-brand " style={{ color: "#1E9694", }}>Medifind</h3>
            <div className="vertical-line"></div>
          </Col>

          {/* About Links */}
          <Col
            md={3}
            className="mb-3 mb-md-0 "
            style={{ paddingRight: "20px", paddingLeft: "20px", position: "relative" }}
          >
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Media Center</a></li>
            </ul>
            <div className="vertical-line"></div>
          </Col>

          {/* Policy Links */}
          <Col
            md={3}
            className="mb-3 mb-md-0"
            style={{ paddingRight: "20px", paddingLeft: "20px", position: "relative" }}
          >
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Policy Library</a></li>
              <li><a href="#" className="text-white text-decoration-none">Privacy</a></li>
            </ul>
            <div className="vertical-line"></div>
          </Col>

          {/* Social Media */}
          <Col
            md={3}
            style={{ paddingLeft: "20px" }}
          >
            <p>Follow us</p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#"><FaFacebookF color="#1E9694" /></a>
              <a href="#"><FaTwitter color="#1E9694" /></a>
              <a href="#"><FaYoutube color="#1E9694" /></a>
            </div>
          </Col>
        </Row>
      </Container>

    </footer>
  );
};






