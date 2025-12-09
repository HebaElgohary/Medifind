import  { useEffect, useState } from 'react'
import { Loader } from '../../components/customComponents/Loader/Loader'
import { useLocation, useParams } from 'react-router-dom'
import { Form, Card, Container } from 'react-bootstrap';
import { useDecoded } from '../../customHooks/useDecode';
import { useAddMedicineForm } from '../../customHooks/AddMedicine';
import { AddBtn } from '../../components/customComponents/Addbtn';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../CardPage.css";

import { BASE_URL } from "../../config.js";

export default function UpdateMedicine() {
  const navigate = useNavigate();
  const goToDonation = () => {
    navigate('/donate')
  }
  const location = useLocation();
  const { id } = useParams();
  const medicineData = location.state;
  const { state } = useLocation();
  const { id: _id, medicineName: name, image_path: image, quantity, exp_date: date, concentration: conc } = state || {};
  console.log('Update Medicine:', { id, medicineData });
  const [img_path, setPath] = useState('');
  const [isUploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "medifined"); // Replace with your Cloudinary Upload Preset
    formData.append("cloud_name", "doxyvufkz");
    setUploading(true) // Replace with your Cloudinary Cloud Name
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData
      );
      console.log(response.data.secure_url);
      setPath(response.data.secure_url)
      setUploading(false)
      // Pass image URL to parent component
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const decodedToken = useDecoded();
  console.log(decodedToken);

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
  // Initialize form values with passed state
  useEffect(() => {
    if (state) {
      setMedicineName(name || '');
      setNumPieces(quantity ? String(quantity) : ''); // Convert to string
      setExpireDate(date || '');
      setConcentration(conc || '');
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (decodedToken) {  // Remove img_path check since it's optional
          const response = await fetch(`${BASE_URL}/medicine/${_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: medicineName,
              quantity: Number(numPieces),
              concentration: concentration,
              expire_date: expireDate,
              image_path: img_path || image, // Use existing image if no new one uploaded
            }),
          });

          console.log('req sent');

          if (!response.ok) {
            throw new Error("Something went wrong!");
          }

          const data = await response.json();
          console.log(data);
          goToDonation();
        } else {
          console.log('something wrong');
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  // In your form controls, use the form hook states instead of passed values
  return (
    <>
      {isUploading && <Loader />}
      <Container style={{ marginTop: "50px" }}>
        <Card className="p-4 shadow-sm">
          <h3 className="text-center mb-4">Update Medicine</h3>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Medicine Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={medicineName}  // Changed from name to medicineName
                    onChange={(e) => setMedicineName(e.target.value)}
                    isInvalid={!!errors.medicineName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.medicineName}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Number of Pieces:</Form.Label>
                  <Form.Control
                    type="text"
                    value={numPieces}    // Changed from quantity to numPieces
                    onChange={(e) => setNumPieces(e.target.value)}
                    isInvalid={!!errors.numPieces}
                  />
                  <Form.Control.Feedback type="invalid">{errors.numPieces}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Expire Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={expireDate}   // Changed from date to expireDate
                    onChange={(e) => setExpireDate(e.target.value)}
                    isInvalid={!!errors.expireDate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.expireDate}</Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Concentration:</Form.Label>
                  <Form.Control
                    type="text"
                    value={concentration} // Changed from conc to concentration
                    onChange={(e) => setConcentration(e.target.value)}
                    isInvalid={!!errors.concentration}
                  />
                  <Form.Control.Feedback type="invalid">{errors.concentration}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="text-center d-flex justify-content-end w-25 ms-auto">
              <AddBtn type="submit" >Update</AddBtn>
            </div>
          </Form>
        </Card>
      </Container>
    </>
  )
}
