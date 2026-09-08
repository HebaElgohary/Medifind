/* eslint-disable no-undef */

import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import MedicineCard from "../components/customComponents/MedicineCard";
import image1 from "../assets/img1.jpg";
import { FaUser } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const OffersReview = () => {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      setServerError(null);

      try {
        const response = await fetch(`${BASE_URL}/medicine`);

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();

        const data = result?.data ?? [];

        setMedicines(Array.isArray(data) ? data : []);

        console.log("Fetched Medicines:", data);
      } catch (error) {
        console.error("Fetch error:", error);
        setServerError(error.message);
        setMedicines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="info" />
      </Container>
    );
  }

  // =========================
  // Error
  // =========================

  if (serverError) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{ minHeight: "50vh" }}
      >
        <h3>Something went wrong</h3>

        <p>
          Failed to load medicines.
        </p>
      </Container>
    );
  }

  // =========================
  // Render
  // =========================

  return (
    <Container className="my-4">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {medicines.map((med) => (
          <MedicineCard
            key={med._id}
            medicines={medicines}
            setMedicines={setMedicines}
            examine={med.examine}
            id={med._id}
            image={
              med.image_path
                ? med.image_path
                : image1
            }
            name={med.name}
            expireDate={med.expire_date}
            user={med.user_id}
            userIcon={FaUser}
          />
        ))}
      </div>
    </Container>
  );
};