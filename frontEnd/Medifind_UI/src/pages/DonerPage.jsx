/* eslint-disable no-unused-vars */
const Url = import.meta.env.VITE_BASE_URL;

import { useEffect } from "react";
import {  Row, Col } from "react-bootstrap";
import { CardDonation } from "../components/customComponents/CardDonation.jsx";
import { AddBtn } from "../components/customComponents/Addbtn";
import { useNavigate } from "react-router-dom";
import { useDecoded } from "../customHooks/useDecode";
import { useGet } from "../customHooks/useGet.js";
import { useDelete } from "../customHooks/useDelete";
import "./CardPage.css";

export const DonorPage = () => {
  const navigate = useNavigate();
  // Fix the update function to return a callback
  const goToUpdateMedicine = (_id, name, image, quantity, date, concentration) => () => {
    navigate(`/UpdateMedicine/${_id}`, {
      state: { id: _id, medicineName: name, image_path: image, quantity, exp_date: date, concentration },
    });
  };

  const decodedToken = useDecoded();
  const baseUrl = `${Url}/medicine`;
  const { data, isLoading, serverError, getRequest } = useGet(
    decodedToken ? `${baseUrl}/${decodedToken.id}` : null
  );

  

  useEffect(() => {
    if (decodedToken) {
      getRequest();
    }
  }, [decodedToken]);

  const { isLoading: deleteLoading, serverError: deleteError, deleteRequest } =
    useDelete(decodedToken ? `${baseUrl}` : null);
    console.log(data);
  // Create a function that returns a callback for handleRemove
  const handleRemove = (donation_id) => async () => {
    try {
      await deleteRequest(donation_id);
      await getRequest();
      console.log("medicine deleted successfully");
    } catch (error) {
      console.error("Failed to delete medicine:", error);
    }
  };

  if (isLoading || deleteLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="text-center">
        <h1>You have no medicine For donation </h1>
        <AddBtn className="mt-5" onClick={() => navigate("/AddMedicine")}>
          Donate
        </AddBtn>
      </div>
    );
  }

  return (
    <>
      <Row>
        {data &&
          data.map((item) => (
            <Col key={item._id} xs={12} md={6} lg={4} className="mb-3">
              <CardDonation
                image={item.image_path}
                name={item.name}
                quantity={item.concentration}
                pcs={item.quantity}
                expDate={item.expire_date}
                examine={item.examine}
                status={item.status}
                OnUpdate={goToUpdateMedicine(
                  item._id,
                  item.name,
                  item.image_path,
                  item.quantity,
                  item.expire_date,
                  item.concentration
                )}
                onRemove={handleRemove(item._id)}  // Pass the callback function
              />
            </Col>
          ))}
      </Row>
    </>
  );
};
