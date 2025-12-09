/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button, Card } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { AddBtn } from "../components/customComponents/Addbtn";
import useMedicineForm from "../customHooks/RequestMedicine";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDecoded } from "../customHooks/useDecode";
import { Loader } from "../components/customComponents/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BASE_URL  = import.meta.env.VITE_BASE_URL;
import { useFetch } from "../customHooks/useFetch";

export const RequestMedicine = () => {
  const baseUrl = BASE_URL;
  const { state } = useLocation();
  const { medicineName, medicine_id, request_id } = state || {};
  const navigate = useNavigate();
  const decodedToken = useDecoded();

  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
const { data:userData, isLoading, serverError } = useFetch( decodedToken ? `${baseUrl}/user/${decodedToken.id}` : '' );

console.log("🚀 ~ RequestMedicine ~ userData:", userData)

  const {
    formData,
    errors,
    handleChange,
    handleDrop,
    validateForm,
    setFormData,
  } = useMedicineForm();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (medicineName) {
      setFormData(prev => ({ ...prev, name: medicineName }));
    }
  }, [medicineName]);


  const handleUpload = async (e) => {
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
      setFormData(prev => ({ ...prev, image: response.data.secure_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        req_name: formData.name,
        requested: true,
        req_description: formData.description,
        user_id: decodedToken.id,
        medicine: medicine_id ? medicine_id : "",
        prescription_img: formData.image,
        status: false,
        examined: false,
      };

      if(!userData[0].ssn){

        
        toast.error("Please complete your profile first", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,  
          progress: undefined,
        });
        setTimeout(() => {
        navigate('/profile');
        }, 3000);
      }
      else {
      
      try {
        const url = request_id !== undefined
          ? `${baseUrl}/request/${request_id}`
          : `${baseUrl}/orders`;
        const method = request_id !== undefined ? "PATCH" : "POST";
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error("Something went wrong!");

        toast.success("Request added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,  
          progress: undefined,
        });

        setShowModal(true);
        setFormData({ name: "", description: "", image: null });

        setTimeout(() => {
          navigate('/need');
        }, 3000);

      } catch (error) {
        toast.error("Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Container>
              {isUploading && <Loader />}
        <Card className="shadow-sm" style={{ padding: "25px 20px", margin: "25px 0px 0px 0px" }}>

    
          <h3 className="text-center mb-4">Request Medicine</h3>
          <Row>
            <Col md={3} className="d-flex justify-content-center">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  backgroundColor: "#EAEAEA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  color: "#666",
                  cursor: "pointer",
                  overflow: "hidden",
                  border: errors.image ? "2px solid red" : "none",
                }}
              >
                {formData.image ? (
                  <img
                    src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <FaPlus />
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleUpload}
                  hidden
                />
              </div>
              {errors.image && <p className="text-danger mt-2">{errors.image}</p>}
            </Col>
            <Col md={9}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={medicine_id}
                    style={{ backgroundColor: medicine_id ? "#f8f9fa" : "#fff" }}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>
                <div className="mt-4 d-flex justify-content-end w-25 ms-auto">
                  <AddBtn style={{ backgroundColor: "var(--main-color)" }} type="submit">
                    {medicine_id ? 'Complete' : 'Add Request'}
                  </AddBtn>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
        <div className=" text-gray px-3 rounded "   > 
          <strong>Note:</strong> 
            Please ensure to complete your profile before adding medicine.
         

        </div>
      </Container>
      
      
    </>
  );
};
