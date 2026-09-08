import { Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AddBtn } from "../../components/customComponents/Addbtn";
import axios from "axios";
import { useDecoded } from "../../customHooks/useDecode";
import { useEffect, useState } from "react";
import { useGet } from "../../customHooks/useGet";
import { Loader } from "../../components/customComponents/Loader/Loader";
import { FaUserCircle } from "react-icons/fa";
import "../CardPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const CompleteProfile = () => {
  const navigate = useNavigate();

  const { decodedToken, isDecoding } = useDecoded();

  const {
    data: userData,
    isLoading,
    getRequest,
  } = useGet(
    decodedToken?.id
      ? `${BASE_URL}/user/${decodedToken.id}`
      : null
  );

  const [formData, setFormData] = useState({
    idNumber: "",
    phoneNumber: "",
    city: "",
    street: "",
    name: "",
    email: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState({
    idNumber: "",
    phoneNumber: "",
  });

  const [isUploading, setUploading] = useState(false);

  const nationalIdRegex =
    /^[23][0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9]{3}[0-9]$/;

  const phoneRegex = /^01[0125][0-9]{8}$/;

  // Get user data
  useEffect(() => {
    if (decodedToken?.id) {
      getRequest();
    }
  }, [decodedToken?.id]);

  // Set user data in form
  useEffect(() => {
    if (!userData) return;

    const user = Array.isArray(userData)
      ? userData[0]
      : userData;

    if (!user) return;

    setFormData({
      idNumber: user.idNumber || "",
      phoneNumber: user.phoneNumber || "",
      city: user.city || "",
      street: user.street || "",
      name: user.name || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
    });
  }, [userData]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Upload image
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("upload_preset", "medifined");
    uploadData.append("cloud_name", "doxyvufkz");

    setUploading(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        uploadData
      );

      setFormData((prev) => ({
        ...prev,
        profileImage: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!nationalIdRegex.test(formData.idNumber)) {
      newErrors.idNumber =
        "Please enter a valid Egyptian National ID";
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid Egyptian phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!decodedToken?.id) {
      console.error("User ID not found");
      return;
    }

    const requestBody = {
      ssn: formData.idNumber,
      phone: formData.phoneNumber,
      location: `${formData.city}, ${formData.street}`,
      profileImage: formData.profileImage,
    };

    try {
       const response = await axios.patch(`${BASE_URL}/user/${decodedToken.id}`, requestBody);


      console.log("Updated successfully:", response.data);

      navigate(-1);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isDecoding || isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: "1000px",
        padding: "40px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {isUploading && <Loader />}

      {/* Profile Header */}
      <div className="d-flex mb-3">
        <div
          className="position-relative d-flex align-items-center justify-content-center"
          style={{
            width: 80,
            height: 80,
            border: "0.5px solid #ccc",
            borderRadius: "50%",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() =>
            document.getElementById("imageUpload")?.click()
          }
        >
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              className="rounded-circle img-fluid w-100 h-100"
              alt="Profile"
            />
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

        <div className="ms-4">
          <h5 className="mt-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-0 w-100"
            />
          </h5>

          <p className="text-muted">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border-0 w-100 text-muted"
            />
          </p>
        </div>
      </div>

      <hr />

      <Form onSubmit={handleSubmit}>
        <Row className="mb-lg-3">
          {/* National ID */}
          <Col className="col-12 col-md-6">
            <Form.Group>
              <Form.Label>National ID:</Form.Label>

              <Form.Control
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                isInvalid={!!errors.idNumber}
                maxLength={14}
                placeholder="Enter Your National ID"
              />

              <Form.Control.Feedback type="invalid">
                {errors.idNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Phone */}
          <Col className="col-12 col-md-6">
            <Form.Group>
              <Form.Label>Phone Number:</Form.Label>

              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                isInvalid={!!errors.phoneNumber}
                maxLength={11}
                placeholder="Enter Egyptian phone number"
              />

              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          {/* City */}
          <Col className="col-12 col-md-6">
            <Form.Group>
              <Form.Label>City:</Form.Label>

              <Form.Control
                as="select"
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Select a city</option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Giza">Giza</option>
                <option value="Mansoura">Mansoura</option>
                <option value="Tanta">Tanta</option>
                <option value="Aswan">Aswan</option>
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Street */}
          <Col className="col-12 col-md-6">
            <Form.Group>
              <Form.Label>Street:</Form.Label>

              <Form.Control
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Enter your street"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Submit */}
        <div className="text-center d-flex justify-content-end w-50 ms-auto">
          <AddBtn className="w-75" type="submit">
            Update
          </AddBtn>
        </div>
      </Form>
    </div>
  );
};