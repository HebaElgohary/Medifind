import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { CardDonation } from "../components/customComponents/CardDonation.jsx";
import { AddBtn } from "../components/customComponents/Addbtn";
import { useDecoded } from "../customHooks/useDecode";
import { useGet } from "../customHooks/useGet.js";
import { useDelete } from "../customHooks/useDelete";
import { Loader } from "../components/customComponents/Loader/Loader.jsx";

import "./CardPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DonorPage = () => {
  const navigate = useNavigate();

  /*
    ============================
    Decode Token
    ============================
  */

  const {
    decodedToken,
    isDecoding,
  } = useDecoded();

  const userId = decodedToken?.id;

  /*
    ============================
    URLs
    ============================
  */

  const baseUrl = `${BASE_URL}/medicine`;

  /*
    ============================
    Get User Medicines
    ============================
  */

  const {
    data,
    isLoading,
    serverError,
    getRequest,
  } = useGet(
    userId
      ? `${baseUrl}/${userId}`
      : null
  );

  /*
    ============================
    Fetch Medicines
    ============================
  */

  useEffect(() => {
    if (isDecoding || !userId) {
      return;
    }

    getRequest();
  }, [userId, isDecoding]);

  /*
    ============================
    Delete Medicine
    ============================
  */

  const {
    isLoading: deleteLoading,
    serverError: deleteError,
    deleteRequest,
  } = useDelete(
    userId
      ? baseUrl
      : null
  );

  /*
    ============================
    Update Medicine Navigation
    ============================
  */

  const goToUpdateMedicine = (
    _id,
    name,
    image,
    quantity,
    date,
    concentration
  ) => {
    navigate(
      `/UpdateMedicine/${_id}`,
      {
        state: {
          id: _id,
          medicineName: name,
          image_path: image,
          quantity,
          exp_date: date,
          concentration,
        },
      }
    );
  };

  /*
    ============================
    Remove Medicine
    ============================
  */

  const handleRemove = async (
    donationId
  ) => {
    try {
      await deleteRequest(donationId);

      /*
        Refetch after deleting
      */

      await getRequest();

      console.log(
        "Medicine deleted successfully"
      );
    } catch (error) {
      console.error(
        "Failed to delete medicine:",
        error
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

  if (isLoading || deleteLoading) {
    return <Loader />;
  }

  /*
    ============================
    Authentication
    ============================
  */

  if (!userId) {
    return (
      <div className="text-center">
        <h3>
          Please login first
        </h3>
      </div>
    );
  }

  /*
    ============================
    Error
    ============================
  */

  if (serverError) {
    return (
      <div className="text-center">
        <h3>
          Something went wrong
        </h3>

        <p>
          Failed to load your medicines.
        </p>
      </div>
    );
  }

  /*
    ============================
    Empty State
    ============================
  */

  if (!data || data.length === 0) {
    return (
      <div className="text-center">

        <h1>
          You have no medicine for donation
        </h1>

        <AddBtn
          className="mt-5"
          onClick={() =>
            navigate("/AddMedicine")
          }
        >
          Donate
        </AddBtn>

      </div>
    );
  }

  /*
    ============================
    Medicines
    ============================
  */

  return (
    <>
      <Row>
        {data.map((item) => (
          <Col
            key={item._id}
            xs={12}
            md={6}
            lg={4}
            className="mb-3"
          >
            <CardDonation

              image={
                item.image_path
              }

              name={
                item.name
              }

              quantity={
                item.concentration
              }

              pcs={
                item.quantity
              }

              expDate={
                item.expire_date
              }

              examine={
                item.examine
              }

              status={
                item.status
              }

              OnUpdate={() =>
                goToUpdateMedicine(
                  item._id,
                  item.name,
                  item.image_path,
                  item.quantity,
                  item.expire_date,
                  item.concentration
                )
              }

              onRemove={() =>
                handleRemove(item._id)
              }

            />
          </Col>
        ))}
      </Row>
    </>
  );
};