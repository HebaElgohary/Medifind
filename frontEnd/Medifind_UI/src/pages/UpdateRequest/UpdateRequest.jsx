/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { AddBtn } from "../../components/customComponents/Addbtn";
import useMedicineForm from "../../customHooks/RequestMedicine";  
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDecoded } from "../../customHooks/useDecode";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { BASE_URL } from "../../config.js";
import { Loader } from "../../components/customComponents/Loader/Loader";


export const UpdateRequest = () => {
  
  // Provide default empty object if state is undefined
  const { state  } = useLocation();
  const { id } = useParams();
  // Fallback: if request_id is not provided via state, try to use the id from the URL
  const { request_id , url ,name ,image } = state; 
  console.log("Request ID:", request_id);
  console.log("🚀 ~ UpdateRequest ~ image:", image)
  console.log("URL:", url);
  const navigate = useNavigate();
  const decodedToken = useDecoded();
    
  const req_Url = `${BASE_URL}/request`;
  const order_Url = `${BASE_URL}/orders`;
  
  const {
    formData,
    errors,
    handleChange,
    handleUpload,
    handleDrop,
    validateForm,
    setFormData,
  } = useMedicineForm();  

  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Check if essential data is available
  if (!request_id || !url) {
    return <div>Error: Missing required update information.</div>;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        req_name: formData.name,
        requested: true,
        req_description: formData.description,
        user_id: decodedToken.id,
        prescription_img: formData.image,
      };
      try {
        const endpoint =
          url === req_Url
            ? `${BASE_URL}/request/${request_id}`
            : `${BASE_URL}/orders/${request_id}`;

        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong!");
        }

        setShowModal(true);
        setFormData({
          name: "",
          description: "",
          image: null,
        });
       
          navigate("/need");
        
      } catch (error) {
        console.error("Submit error:", error);
      }
    }
  };

  return (
    <>
      {isUploading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,

          }}
        >
          <Loader />
        </div>
      )}
      <Container style={{ marginTop: "50px" }}>
        <Card className="shadow-sm" style={{ padding: "25px 20px", margin: "50px 0px" }}>
          <h3 className="text-center mb-4">Update Request</h3>
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
                    src={image}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <FaPlus />
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={(e) => {
                    setIsUploading(true);
                    handleUpload(e).finally(() => {
                      setIsUploading(false);
                    });
                  }}
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
                    value={name}
                    onChange={handleChange}
                    style={{ backgroundColor: request_id ? "#f8f9fa" : "#fff" }}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={{ backgroundColor: "#ffffff" }}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="mt-4 d-flex justify-content-end w-25 ms-auto">
                  <AddBtn style={{ backgroundColor: "var(--main-color)" }} type="submit">
                    {request_id ? "Update" : "Add Request"}
                  </AddBtn>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1050,
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "15px",
                width: "90%",
                maxWidth: "400px",
                position: "relative",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <FaCheckCircle size={60} color="#1E9694" />
              </motion.div>

              <motion.h4
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  textAlign: "center",
                  color: "#1E9694",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                Success!
              </motion.h4>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  textAlign: "center",
                  color: "#666",
                  marginBottom: "2rem",
                  fontSize: "1.1rem",
                }}
              >
                {request_id
                  ? "Your request has been updated successfully!"
                  : "Your request has been added successfully!"}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#1E9694",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 5px 15px rgba(30, 150, 148, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
    </>
  );
};
