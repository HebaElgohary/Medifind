import { useEffect, useState } from "react";
import { Loader } from "../../components/customComponents/Loader/Loader";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, Card, Container } from "react-bootstrap";
import { useDecoded } from "../../customHooks/useDecode";
import { useAddMedicineForm } from "../../customHooks/AddMedicine";
import { AddBtn } from "../../components/customComponents/Addbtn";
import axios from "axios";
import "../CardPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UpdateMedicine() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { decodedToken, isDecoding } = useDecoded();

  const state = location.state || {};

  const {
    id: stateId,
    medicineName: name,
    image_path: image,
    quantity,
    exp_date: date,
    concentration: conc,
  } = state;

  const medicineId = stateId || id;

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
    validateForm,
  } = useAddMedicineForm();

  useEffect(() => {
    if (!state) return;

    setMedicineName(name || "");
    setNumPieces(quantity ? String(quantity) : "");
    setExpireDate(date || "");
    setConcentration(conc || "");
  }, [
    state,
    name,
    quantity,
    date,
    conc,
    setMedicineName,
    setNumPieces,
    setExpireDate,
    setConcentration,
  ]);

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

      setPath(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const goToDonation = () => {
    navigate("/donate");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isDecoding) {
      return;
    }

    if (!decodedToken?.id) {
      console.log("User is not authenticated");
      return;
    }

    if (!medicineId) {
      console.log("Medicine ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/medicine/${medicineId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: medicineName,
            quantity: Number(numPieces),
            concentration: concentration,
            expire_date: expireDate,
            image_path: img_path || image,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      console.log("Medicine updated successfully:", data);

      goToDonation();
    } catch (error) {
      console.error("Update medicine error:", error);
    }
  };

  if (isDecoding) {
    return <Loader />;
  }

  return (
    <>
      {isUploading && <Loader />}

      <Container style={{ marginTop: "50px" }}>
        <Card className="p-4 shadow-sm">
          <h3 className="text-center mb-4">
            Update Medicine
          </h3>

          <Form onSubmit={handleSubmit}>
            <div className="row">

              {/* Medicine Name */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Medicine Name:
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={medicineName}
                    onChange={(e) =>
                      setMedicineName(e.target.value)
                    }
                    isInvalid={!!errors.medicineName}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.medicineName}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Number of Pieces */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Number of Pieces:
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={numPieces}
                    onChange={(e) =>
                      setNumPieces(e.target.value)
                    }
                    isInvalid={!!errors.numPieces}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.numPieces}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Expire Date */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Expire Date:
                  </Form.Label>

                  <Form.Control
                    type="date"
                    value={expireDate}
                    onChange={(e) =>
                      setExpireDate(e.target.value)
                    }
                    isInvalid={!!errors.expireDate}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.expireDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Concentration */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Concentration:
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={concentration}
                    onChange={(e) =>
                      setConcentration(e.target.value)
                    }
                    isInvalid={!!errors.concentration}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.concentration}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Image */}
              <div className="col-12">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Add Image:
                  </Form.Label>

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
              <AddBtn
                type="submit"
                disabled={isUploading || isDecoding}
              >
                Update
              </AddBtn>
            </div>
          </Form>
        </Card>
      </Container>
    </>
  );
}