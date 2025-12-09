/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Button } from "react-bootstrap";
const BASE_URL  = import.meta.env.VITE_BASE_URL;
 
const MedicineCard = ({ 
  image, 
  name, 
  expireDate, 
  id, 
  medicines, 
  setMedicines, 
  examine,
  user,
  userIcon: IconComponent
}) => {

  // const baseUrl = import.meta.env.VITE_BASE_URL;
  // const[reviews,setReviews]=useState({});
  // const[examine,setExamine]=useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAccept = async (id) => {
    // setExamine(true)
    try {
        const response = await fetch(`${BASE_URL}/medicine/${id}`, {
            method: "PATCH", // Change from POST to PATCH
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: true ,examine:true}),
        });

        if (!response.ok) {
            throw new Error(`Failed to accept request: ${response.status}`);
        }

        // Remove the accepted request from the state
        setMedicines((prevReview) => prevReview.filter((review) => review._id !== id));

    } catch (error) {
        console.error("Error accepting request:", error);
    }
};
  const handleReject = async (id) => {
    // setExamine(true)
    try {
        const response = await fetch(`${BASE_URL}/medicine/${id}`, {
            method: "PATCH", // Change from POST to PATCH
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: false ,examine:true}),
        });

        if (!response.ok) {
            throw new Error(`Failed to accept request: ${response.status}`);
        }

        // Remove the accepted request from the state
        setMedicines((prevReview) => prevReview.filter((review) => review._id !== id));

    } catch (error) {
        console.error("Error accepting request:", error);
    }
};

  return (
    examine ? null : (
      <Card 
        style={{ 
          width: "300px",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginRight: "30px"

        }}
        className="mb-3"
      >
        <div style={{ padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                border: "2px solid #f0f0f0"
              }}
            />
          ) : (
            <div 
              className="rounded-circle bg-white d-flex align-items-center justify-content-center"
              style={{ 
                width: "40px", 
                height: "40px",
                border: "2px solid #f0f0f0"
              }}
            >
              <IconComponent color="#9c9f9f" size={24} />
            </div>
          )}
          <h6 className="mb-0" style={{ color: "#333" }}>{user?.name || "User"}</h6>
        </div>

        <Card.Img 
          src={image} 
          alt={name}
          style={{ 
            width: "100%",
            height: "200px",
            objectFit: "cover"
          }} 
        />

        <Card.Body className="p-3">
          <div className="mb-3">
            <p className="mb-2" style={{ fontSize: '16px', color: '#333' }}>
              <strong>Name:</strong> {name || "Unknown"}
            </p>
            <p className="mb-2" style={{ fontSize: '14px', color: '#333' }}>
              <strong>Expire date:</strong> {formatDate(expireDate)}
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <Button 
              style={{ 
                backgroundColor: "#00BCD4",
                border: "none",
                flex: 1,
                padding: "8px",
                borderRadius: "8px"
              }} 
              onClick={() => handleAccept(id)}
            >
              Accept
            </Button>
            <Button 
              style={{ 
                backgroundColor: "#FF5252",
                border: "none",
                flex: 1,
                padding: "8px",
                borderRadius: "8px"
              }}  
              onClick={() => handleReject(id)}
            >
              Reject
            </Button>
          </div>
        </Card.Body>
      </Card>
    )
  );
};

export default MedicineCard;
