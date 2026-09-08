import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { AddBtn } from "../components/customComponents/Addbtn";
import useMedicineForm from "../customHooks/RequestMedicine";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDecoded } from "../customHooks/useDecode";
import { Loader } from "../components/customComponents/Loader/Loader";
import {
  toast,
  ToastContainer,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetch } from "../customHooks/useFetch";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const RequestMedicine = () => {
  const baseUrl = BASE_URL;

  const { state } = useLocation();

  const {
    medicineName,
    medicine_id,
    request_id,
  } = state || {};

  const navigate = useNavigate();

  // =========================
  // Auth
  // =========================

  const {
    decodedToken,
    isDecoding,
  } = useDecoded();

  const userId = decodedToken?.id;

  // =========================
  // States
  // =========================

  const [isUploading, setUploading] =
    useState(false);

  // =========================
  // User Data
  // =========================

  const {
    data: userData,
    isLoading: userLoading,
    serverError: userError,
  } = useFetch(
    userId
      ? `${baseUrl}/user/${userId}`
      : null
  );

  // Handle both array and object response
  const user = Array.isArray(userData)
    ? userData[0]
    : userData;

  // =========================
  // Form
  // =========================

  const {
    formData,
    errors,
    handleChange,
    handleDrop,
    validateForm,
    setFormData,
  } = useMedicineForm();

  // =========================
  // Set medicine name
  // =========================

  useEffect(() => {
    if (medicineName) {
      setFormData((prev) => ({
        ...prev,
        name: medicineName,
      }));
    }
  }, [medicineName, setFormData]);

  // =========================
  // Upload Image
  // =========================

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append(
      "upload_preset",
      "medifined"
    );
    uploadData.append(
      "cloud_name",
      "doxyvufkz"
    );

    setUploading(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        uploadData
      );

      setFormData((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));
    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      toast.error(
        "Failed to upload image",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error(
        "Please login first",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Make sure user data is available
    if (userLoading) {
      return;
    }

    if (userError) {
      toast.error(
        "Failed to load your profile",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      return;
    }

    // =========================
    // Check Profile
    // =========================

    if (!user?.ssn) {
      toast.error(
        "Please complete your profile first",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      setTimeout(() => {
        navigate("/profile");
      }, 3000);

      return;
    }

    // =========================
    // Request Data
    // =========================

    const requestData = {
      req_name: formData.name,
      requested: true,
      req_description:
        formData.description,
      user_id: userId,
      medicine: medicine_id || "",
      prescription_img:
        formData.image,
      status: false,
      examined: false,
    };

    try {
      const url =
        request_id !== undefined
          ? `${baseUrl}/request/${request_id}`
          : `${baseUrl}/orders`;

      const method =
        request_id !== undefined
          ? "PATCH"
          : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            requestData
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      toast.success(
        request_id !== undefined
          ? "Request updated successfully"
          : "Request added successfully",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setFormData({
        name: "",
        description: "",
        image: null,
      });

      setTimeout(() => {
        navigate("/need");
      }, 3000);
    } catch (error) {
      console.error(
        "Request error:",
        error
      );

      toast.error(
        "Something went wrong",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  // =========================
  // Loading
  // =========================

  if (isDecoding || userLoading) {
    return <Loader />;
  }

  // =========================
  // Render
  // =========================

  return (
    <>
      <ToastContainer />

      <Container>
        {isUploading && <Loader />}

        <Card
          className="shadow-sm"
          style={{
            padding: "25px 20px",
            margin: "25px 0px 0px 0px",
          }}
        >
          <h3 className="text-center mb-4">
            Request Medicine
          </h3>

          <Row>
            {/* =========================
                IMAGE
            ========================= */}

            <Col
              md={3}
              className="d-flex justify-content-center"
            >
              <div
                onDragOver={(e) =>
                  e.preventDefault()
                }
                onDrop={handleDrop}
                onClick={() =>
                  document
                    .getElementById(
                      "fileInput"
                    )
                    ?.click()
                }
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  backgroundColor:
                    "#EAEAEA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  fontSize: "40px",
                  color: "#666",
                  cursor: "pointer",
                  overflow: "hidden",
                  border: errors.image
                    ? "2px solid red"
                    : "none",
                }}
              >
                {formData.image ? (
                  <img
                    src={
                      typeof formData.image ===
                      "string"
                        ? formData.image
                        : URL.createObjectURL(
                            formData.image
                          )
                    }
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
                  onChange={handleUpload}
                  hidden
                />
              </div>

              {errors.image && (
                <p className="text-danger mt-2">
                  {errors.image}
                </p>
              )}
            </Col>

            {/* =========================
                FORM
            ========================= */}

            <Col md={9}>
              <Form
                onSubmit={handleSubmit}
              >
                {/* =========================
                    NAME
                ========================= */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Name:
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!!medicine_id}
                    style={{
                      backgroundColor:
                        medicine_id
                          ? "#f8f9fa"
                          : "#fff",
                    }}
                    isInvalid={
                      !!errors.name
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* =========================
                    DESCRIPTION
                ========================= */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Description:
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    isInvalid={
                      !!errors.description
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {
                      errors.description
                    }
                  </Form.Control.Feedback>
                </Form.Group>

                {/* =========================
                    BUTTON
                ========================= */}

                <div className="mt-4 d-flex justify-content-end w-25 ms-auto">
                  <AddBtn
                    style={{
                      backgroundColor:
                        "var(--main-color)",
                    }}
                    type="submit"
                  >
                    {medicine_id
                      ? "Complete"
                      : "Add Request"}
                  </AddBtn>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>

        <div className="text-gray px-3 rounded">
          <strong>Note:</strong>

          <span className="ms-1">
            Please ensure to complete your
            profile before adding medicine.
          </span>
        </div>
      </Container>
    </>
  );
};