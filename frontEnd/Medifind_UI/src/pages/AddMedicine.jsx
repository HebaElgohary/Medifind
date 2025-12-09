/* eslint-disable no-undef */
import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Container, Form } from "react-bootstrap";

import { AddBtn } from "../components/customComponents/Addbtn";
import { Loader } from "../components/customComponents/Loader/Loader";
import { useAddMedicineForm } from "../customHooks/AddMedicine";
import { useDecoded } from "../customHooks/useDecode";
const BASE_URL  = import.meta.env.VITE_BASE_URL;
import { useFetch } from "../customHooks/useFetch";



export const AddMedicine = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [img_path, setPath] = useState("");
  const [isUploading, setUploading] = useState(false);

  const {
    medicineName,
    numPieces,
    expireDate,
    concentration,
    errors,
    setMedicineName,
    setNumPieces,
    setExpireDate,
    setConcentration,
    setImage,
    validateForm,
  } = useAddMedicineForm();

  const decodedToken = useDecoded();
  const { data:userData } = useFetch( decodedToken ? `${baseUrl}/user/${decodedToken.id}` : '' );
  
  
 
    
  
  
 
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update the hook's image state so validation passes.
    setImage(file);

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

      console.log("Secure URL:", response.data.secure_url);
      setPath(response.data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (img_path && decodedToken ) {

          // Check if the user has a valid profile
          if ( userData && userData[0].ssn) {
             const response = await fetch(`${baseUrl}/medicine`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: medicineName,
                  quantity: Number(numPieces),
                  concentration: concentration,
                  expire_date: expireDate,
                  examine: false,
                  status: false,
                  image_path: img_path,
                  user_id: decodedToken.id,
                }),
              });

              console.log("Response status:", response.status);
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong!");
              }

              toast.success("Medicine added successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });

            // Clear the form fields
            setMedicineName("");
            setNumPieces("");
            setExpireDate("");
            setConcentration("");
            setImage(null); // Clear the image state in the hook.
            document.getElementById("imageInput").value = "";

            // Navigate after a delay so that the toast can be seen.
            setTimeout(() => {
              console.log("Navigating to /donate");
              navigate("/donate");
            }, 2000);
          }
          else{ 
             console.log("User profile is not completed.... Redirecting to profile page.");
            toast.error("Please complete your profile before adding medicine", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              navigate("/profile");
            }, 3000);
          }
        } else {
          throw new Error("Missing data");
        }
      
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
        console.error("Submit error:", error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      {isUploading && <Loader />}
      <Container>
        <Card className="p-4 shadow-sm">
          <h3 className="text-center mb-4">Add Medicine</h3>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Medicine Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    isInvalid={!!errors.medicineName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.medicineName}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Number of Pieces:</Form.Label>
                  <Form.Control
                    type="text"
                    value={numPieces}
                    onChange={(e) => setNumPieces(e.target.value)}
                    isInvalid={!!errors.numPieces}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.numPieces}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Expire Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    isInvalid={!!errors.expireDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.expireDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Concentration:</Form.Label>
                  <Form.Control
                    type="text"
                    value={concentration}
                    onChange={(e) => setConcentration(e.target.value)}
                    isInvalid={!!errors.concentration}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.concentration}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group className="mb-3">
                  <Form.Label>Add Image:</Form.Label>
                  <Form.Control
                    id="imageInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleUpload}
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="text-center d-flex justify-content-end w-25 ms-auto">
              <AddBtn type="submit" disabled={!img_path}>
                Add
              </AddBtn>
            </div>
          </Form>
        </Card>
        <div   className="  px-3 rounded text-gray " > 
          <strong>Note:</strong> 
            Please ensure to complete your profile before adding medicine.
         

        </div>
      </Container>
    </>
  );
};


