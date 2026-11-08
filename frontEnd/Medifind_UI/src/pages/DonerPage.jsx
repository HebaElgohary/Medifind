
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { CardDonation } from "../components/customComponents/CardDonation.jsx";
import { AddBtn } from "../components/customComponents/Addbtn";
import { useDecoded } from "../customHooks/useDecode";
import { useGet } from "../customHooks/useGet.js";
import { useDelete } from "../customHooks/useDelete";
import { Loader } from "../components/customComponents/Loader/Loader.jsx";

import "./DonorPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DonorPage = () => {
  const navigate = useNavigate();

  const { decodedToken, isDecoding } = useDecoded();
  const userId = decodedToken?.id;

  const baseUrl = `${BASE_URL}/medicine`;

  const { data, isLoading, serverError, getRequest } = useGet(
    userId ? `${baseUrl}/${userId}` : null
  );

  useEffect(() => {
    if (isDecoding || !userId) return;
    getRequest();
  }, [userId, isDecoding]);

  const {
    isLoading: deleteLoading,
    serverError: deleteError,
    deleteRequest,
  } = useDelete(userId ? baseUrl : null);

  const goToUpdateMedicine = (
    _id,
    name,
    image,
    quantity,
    date,
    concentration
  ) => {
    navigate(`/UpdateMedicine/${_id}`, {
      state: {
        id: _id,
        medicineName: name,
        image_path: image,
        quantity,
        exp_date: date,
        concentration,
      },
    });
  };

  console.log("Decoded Token:", decodedToken);
  console.log("User ID:", userId);
  console.log("Medicines Data:", data);

  const handleRemove = async (donationId) => {
    try {
      await deleteRequest(donationId);
      await getRequest();
      console.log("Medicine deleted successfully");
    } catch (error) {
      console.error("Failed to delete medicine:", error);
    }
  };

  if (isDecoding) return <Loader />;

  if (isLoading || deleteLoading) return <Loader />;

  if (serverError) {
    return (
      <Container className="donor-page">
        <div className="donor-message">
          <h3>Something went wrong</h3>
          <p>Failed to load your medicines.</p>
        </div>
      </Container>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Container className="donor-page">
        <div className="donor-empty-state">
          <h2>You have no medicine for donation</h2>

          <p>
            Share your available medicines and help someone in need.
          </p>

          <AddBtn
            className="mt-3"
            onClick={() => navigate("/AddMedicine")}
          >
            Donate
          </AddBtn>
        </div>
      </Container>
    );
  }

  return (
    <Container className="donor-page">
      <div className="donor-page-header">
        <div>
          <h2>My Donations</h2>
          <p>Manage the medicines you have shared for donation.</p>
        </div>

        <AddBtn onClick={() => navigate("/AddMedicine")}>
          Donate Medicine
        </AddBtn>
      </div>

      <div className="donor-grid">
        {data.map((item) => (
          <div key={item._id} className="donor-grid-column">
            <CardDonation
              image={item.image_path}
              name={item.name}
              quantity={item.concentration}
              pcs={item.quantity}
              expDate={item.expire_date}
              examine={item.examine}
              status={item.status}
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
              onRemove={() => handleRemove(item._id)}
            />
          </div>
        ))}
      </div>
    </Container>
  );
};
