/* eslint-disable no-undef */
import  { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import MedicineCard from "../components/customComponents/MedicineCard"; 
import { BASE_URL } from "../config.js";
import image1 from "../assets/img1.jpg";
import { FaUser } from 'react-icons/fa';

export const OffersReview = () => {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = BASE_URL;
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(`${baseUrl}/medicine`);
        console.log(response);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      
        const result = await response.json();
        const data = result.data;
        setMedicines(data);
        console.log("Fetched Medicines:", data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, [baseUrl]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" variant="info" />
      </Container>
    );
  }

  return (
    <>
      <Container className="my-4">
        {/* <h3 className="text-center mb-4">Offers Review</h3> */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          alignItems: "start"
        }}>
          {Array.isArray(medicines) && medicines.map((med, index) => (
            <MedicineCard
              medicines={medicines}
              setMedicines={setMedicines}
              examine={med.examine}
              id={med._id}
              key={index}
              image={med.image_path ? med.image_path : image1} 
              name={med.name}
              expireDate={med.expire_date}
              user={med.user_id}
              userIcon={FaUser}
            />
          ))}
        </div>
      </Container>
    </>
  );
};
