import { useState, useEffect } from "react";

import {
  Container,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";

import { FaPlus } from "react-icons/fa";

import { AddBtn } from "../../components/customComponents/Addbtn";
import useMedicineForm from "../../customHooks/RequestMedicine";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useDecoded } from "../../customHooks/useDecode";

import { Loader } from "../../components/customComponents/Loader/Loader";

import "../CardPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const UpdateRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  /*
    ============================
    Location State
    ============================
  */

  const state = location.state || {};

  const {
    request_id: stateRequestId,
    url,
    name,
    image,
  } = state;

  /*
    If request_id doesn't exist in state,
    use the id from URL
  */
  const requestId = stateRequestId || id;

  /*
    ============================
    Authentication
    ============================
  */

  const {
    decodedToken,
    isDecoding,
  } = useDecoded();

  /*
    ============================
    URLs
    ============================
  */

  const req_Url = `${BASE_URL}/request`;
  const order_Url = `${BASE_URL}/orders`;

  /*
    ============================
    Form
    ============================
  */

  const {
    formData,
    errors,
    handleChange,
    handleUpload,
    handleDrop,
    validateForm,
    setFormData,
  } = useMedicineForm();

  /*
    ============================
    Local State
    ============================
  */

  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  /*
    ============================
    Initialize Form
    ============================
  */

  useEffect(() => {
    if (!state) return;

    setFormData((prev) => ({
      ...prev,
      name: name || "",
      description: prev.description || "",
      image: image || null,
    }));
  }, [state, name, image, setFormData]);

  /*
    ============================
    Submit
    ============================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDecoding) {
      return;
    }

    if (!decodedToken?.id) {
      console.error("User is not authenticated");
      return;
    }

    if (!requestId) {
      console.error("Request ID is missing");
      return;
    }

    if (!validateForm()) {
      return;
    }

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
          ? `${BASE_URL}/request/${requestId}`
          : `${order_Url}/${requestId}`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong!";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData?.message || errorMessage;
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      console.log(
        "Request updated successfully:",
        data
      );

      setShowModal(true);

      setFormData({
        name: "",
        description: "",
        image: null,
      });

      navigate("/need");
    } catch (error) {
      console.error(
        "Submit error:",
        error
      );
    }
  };

  /*
    ============================
    Missing State
    ============================
  */

  if (!requestId || !url) {
    return (
      <div className="text-center mt-5">
        <h4>
          Error: Missing required update information.
        </h4>

        <AddBtn
          className="mt-3"
          onClick={() => navigate("/need")}
        >
          Back
        </AddBtn>
      </div>
    );
  }

  /*
    ============================
    Loading
    ============================
  */

  if (isDecoding) {
    return <Loader />;
  }

  /*
    ============================
    UI
    ============================
  */

  return (
    <>
      {isUploading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      <Container style={{ marginTop: "50px" }}>
        <Card
          className="shadow-sm"
          style={{
            padding: "25px 20px",
            margin: "50px 0px",
          }}
        >
          <h3 className="text-center mb-4">
            Update Request
          </h3>

          <Row>
            {/* =========================
                Image Section
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
                    .getElementById("fileInput")
                    ?.click()
                }
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
                  onChange={(e) => {
                    setIsUploading(true);

                    const uploadPromise =
                      handleUpload(e);

                    if (
                      uploadPromise &&
                      typeof uploadPromise.finally ===
                        "function"
                    ) {
                      uploadPromise.finally(() => {
                        setIsUploading(false);
                      });
                    } else {
                      setIsUploading(false);
                    }
                  }}
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
                Form Section
            ========================= */}

            <Col md={9}>
              <Form onSubmit={handleSubmit}>
                {/* Name */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Name:
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      backgroundColor: requestId
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

                {/* Description */}

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
                    style={{
                      backgroundColor:
                        "#ffffff",
                    }}
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

                {/* Submit */}

                <div className="mt-4 d-flex justify-content-end w-25 ms-auto">
                  <AddBtn
                    style={{
                      backgroundColor:
                        "var(--main-color)",
                    }}
                    type="submit"
                    disabled={
                      isDecoding ||
                      isUploading
                    }
                  >
                    Update
                  </AddBtn>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};