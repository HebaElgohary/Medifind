import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  Card,
  Container,
  Form,
} from "react-bootstrap";

import { AddBtn } from "../components/customComponents/Addbtn";
import { Loader } from "../components/customComponents/Loader/Loader";
import { useAddMedicineForm } from "../customHooks/AddMedicine";
import { useDecoded } from "../customHooks/useDecode";
import { useFetch } from "../customHooks/useFetch";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AddMedicine = () => {
  const navigate = useNavigate();

  const [img_path, setPath] = useState("");
  const [isUploading, setUploading] = useState(false);

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
    Medicine Form
    ============================
  */

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

  /*
    ============================
    Get Current User
    ============================
  */

  const {
    data: userData,
    isLoading: isUserLoading,
  } = useFetch(
    decodedToken?.id
      ? `${BASE_URL}/user/${decodedToken.id}`
      : null
  );

  /*
    Normalize User Data
  */

  const user = Array.isArray(userData)
    ? userData[0]
    : userData;

  /*
    ============================
    Upload Image
    ============================
  */

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

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

      console.log(
        "Secure URL:",
        response.data.secure_url
      );

      setPath(
        response.data.secure_url
      );
    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      toast.error(
        "Image upload failed",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setUploading(false);
    }
  };

  /*
    ============================
    Submit Medicine
    ============================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
      Don't submit while token
      is still being decoded
    */

    if (isDecoding) {
      return;
    }

    /*
      Make sure user is authenticated
    */

    if (!decodedToken?.id) {
      toast.error(
        "You must be logged in first",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      return;
    }

    /*
      Validate Form
    */

    if (!validateForm()) {
      return;
    }

    /*
      Make sure image exists
    */

    if (!img_path) {
      toast.error(
        "Please upload medicine image",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      return;
    }

    /*
      Make sure profile is completed
    */

    if (!user?.ssn) {
      console.log(
        "User profile is not completed. Redirecting to profile page."
      );

      toast.error(
        "Please complete your profile before adding medicine",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setTimeout(() => {
        navigate("/profile");
      }, 3000);

      return;
    }

    /*
      ============================
      Send Medicine Data
      ============================
    */

    try {
      const response = await fetch(
        `${BASE_URL}/medicine`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: medicineName,

            quantity: Number(
              numPieces
            ),

            concentration:
              concentration,

            expire_date:
              expireDate,

            examine: false,

            status: false,

            image_path:
              img_path,

            user_id:
              decodedToken.id,
          }),
        }
      );

      console.log(
        "Response status:",
        response.status
      );

      /*
        Handle API error
      */

      if (!response.ok) {
        let errorMessage =
          "Something went wrong!";

        try {
          const errorData =
            await response.json();

          errorMessage =
            errorData?.message ||
            errorMessage;
        } catch {
          // Response wasn't JSON
        }

        throw new Error(
          errorMessage
        );
      }

      /*
        ============================
        Success
        ============================
      */

      toast.success(
        "Medicine added successfully",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      /*
        Clear Form
      */

      setMedicineName("");
      setNumPieces("");
      setExpireDate("");
      setConcentration("");
      setImage(null);
      setPath("");

      const imageInput =
        document.getElementById(
          "imageInput"
        );

      if (imageInput) {
        imageInput.value = "";
      }

      /*
        Navigate after success
      */

      setTimeout(() => {
        navigate("/donate");
      }, 2000);
    } catch (error) {
      console.error(
        "Submit error:",
        error
      );

      toast.error(
        error?.message ||
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

  /*
    ============================
    Loading
    ============================
  */

  if (isDecoding) {
    return <Loader />;
  }

  if (
    decodedToken?.id &&
    isUserLoading
  ) {
    return <Loader />;
  }

  /*
    ============================
    UI
    ============================
  */

  return (
    <>
      <ToastContainer />

      {isUploading && <Loader />}

      <Container>
        <Card className="p-4 shadow-sm">
          <h3 className="text-center mb-4">
            Add Medicine
          </h3>

          <Form
            onSubmit={handleSubmit}
          >
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
                      setMedicineName(
                        e.target.value
                      )
                    }
                    isInvalid={
                      !!errors.medicineName
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {
                      errors.medicineName
                    }
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
                      setNumPieces(
                        e.target.value
                      )
                    }
                    isInvalid={
                      !!errors.numPieces
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {
                      errors.numPieces
                    }
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
                      setExpireDate(
                        e.target.value
                      )
                    }
                    isInvalid={
                      !!errors.expireDate
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {
                      errors.expireDate
                    }
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
                    value={
                      concentration
                    }
                    onChange={(e) =>
                      setConcentration(
                        e.target.value
                      )
                    }
                    isInvalid={
                      !!errors.concentration
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {
                      errors.concentration
                    }
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
                    onChange={
                      handleUpload
                    }
                    isInvalid={
                      !!errors.image
                    }
                    disabled={
                      isUploading
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {/* Add Button */}

            <div className="text-center d-flex justify-content-end w-25 ms-auto">
              <AddBtn
                type="submit"
                disabled={
                  !img_path ||
                  isUploading ||
                  isDecoding
                }
              >
                Add
              </AddBtn>
            </div>
          </Form>
        </Card>

        <div className="px-3 rounded text-gray">
          <strong>
            Note:
          </strong>{" "}
          Please ensure to complete
          your profile before adding
          medicine.
        </div>
      </Container>
    </>
  );
};