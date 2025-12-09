/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AddBtn } from "../../components/customComponents/Addbtn";
import axios from 'axios';
import { useDecoded } from '../../customHooks/useDecode';
import { useEffect, useState } from "react";
import { useGet } from "../../customHooks/useGet";
import { Loader } from "../../components/customComponents/Loader/Loader";
import { FaUserCircle } from "react-icons/fa";
import "../CardPage.css";

const BASE_URL  = import.meta.env.VITE_BASE_URL;

export const CompleteProfile = () => {
  const navigate = useNavigate();
  const decodedToken = useDecoded();
  const { data: userData, isLoading, getRequest } = useGet(decodedToken ? `${BASE_URL}/user/${decodedToken.id}` : null);
  
  // Egyptian National ID regex with validation rules
  const nationalIdRegex = /^[23][0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9]{3}[0-9]$/;
  // Egyptian phone number regex (starts with 01 followed by 9 digits)
  const phoneRegex = /^01[0125][0-9]{8}$/;
  
  const [errors, setErrors] = useState({
    idNumber: '',
    phoneNumber: ''
  });
  
  useEffect(() => {
    if (decodedToken && decodedToken.id) {
      (async () => { await getRequest(); })();
    }
  }, [decodedToken]);

  const [requestBody, setRequestBody] = useState({
    ssn: "",
    phone: "",
    location: "",
    profileImage: ""
  });

  const [formData, setFormData] = useState({
    ssn: "",
    phone: "",
    location: "",
    name: "Your Name",
    email: "yourname@gmail.com",
    profileImage: ""
  });

  useEffect(() => {
    if (userData && Array.isArray(userData) && userData.length > 0) {
      const user = userData[0];
      setFormData({
        ssn: user.idNumber || "",
        phone: user.phoneNumber || "",
        location: user.city+" "+user.street || "",
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || ""
      });
    }
  }, [userData]);

  const [isUploading, setUploading] = useState(false);
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "medifined");
    formData.append("cloud_name", "doxyvufkz");
    
    setUploading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData
      );
      setFormData({ ...formData, profileImage: response.data.secure_url });
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!nationalIdRegex.test(formData.idNumber)) {
      newErrors.idNumber = 'Please enter a valid Egyptian National ID (14 digits starting with 2 or 3)';
    }
    
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Egyptian phone number (e.g., 01234567890)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!decodedToken?.id) {
      console.error("User ID not found");
      return;
    }
    
    requestBody.ssn = formData.idNumber;
    requestBody.phone = formData.phoneNumber;
    requestBody.location = `${formData.city}, ${formData.street}`;
    requestBody.profileImage = formData.profileImage;
    try {
      const response = await axios.patch(`${BASE_URL}/user/${decodedToken.id}`, requestBody);
      console.log("Updated successfully:", response.data);
      navigate(-1);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    userData ? (
      <div className="container" style={{ maxWidth: "1000px", padding: "40px", backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        {isUploading && <Loader />}
        <div className="d-flex mb-3">
         <div 
            className="position-relative d-inline-block d-flex align-items-center justify-content-center"
            style={{ width: 80, height: 80, border: "0.5px solid #ccc", borderRadius: "50%", cursor: "pointer", overflow: "hidden" }}
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {formData.profileImage ? (
              <img src={formData.profileImage} className="rounded-circle img-fluid w-100 h-100" alt="Profile" />
            ) : (
              <FaUserCircle size={80} color="#ccc" />
            )}
          </div>
          <input 
            id="imageUpload" 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={handleImageChange} 
          />
          <div className="ms-4" >
            <h5 className="mt-2">
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-0 w-100" />
            </h5>
            <p className="text-muted">
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border-0 w-100 text-muted" />
            </p>
          </div>
        </div>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Row className="mb-lg-3 ">
            <Col className="col-12 col-md-6">
              <Form.Group>
                <Form.Label>National ID:</Form.Label>
                <Form.Control 
                  type="text" 
                  name="idNumber" 
                  value={formData.idNumber} 
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  isInvalid={!!errors.idNumber}
                  maxLength="14"
                  placeholder="Enter Your National ID"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.idNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className="col-12 col-md-6" >
              <Form.Group>
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control 
                  type="text" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  isInvalid={!!errors.phoneNumber}
                  maxLength="11"
                  placeholder="Enter Egyptian phone number "
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3 "> 
            <Col className="col-12 col-md-6">
              <Form.Group>
                <Form.Label>City:</Form.Label>
                <Form.Control as="select" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                  <option value="">Select a city</option>
                  {["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Aswan"].map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Street:</Form.Label>
                <Form.Control type="text" name="street" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center d-flex justify-content-end w-50 ms-auto">
            <AddBtn className="w-75" type="submit">Update</AddBtn>
          </div>
        </Form>
      </div>
    ) : (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  );
};

