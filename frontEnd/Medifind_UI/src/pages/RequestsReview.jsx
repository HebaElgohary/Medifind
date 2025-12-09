/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { Container,  Button, Card, Spinner } from "react-bootstrap";

import { FaUser } from "react-icons/fa";
const BASE_URL  = import.meta.env.VITE_BASE_URL;


import "./RequestsReview.css";

export const RequestsReview = () => {
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");

  const req_url = `${BASE_URL}/request`;
  const order_url = `${BASE_URL}/orders`;

  const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [requestsData, ordersData] = await Promise.all([
          fetchData(req_url),
          fetchData(order_url)
        ]);
        
        setRequests(requestsData || []);
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [req_url, order_url]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" variant="info" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center text-danger">
          <h5>Error loading data</h5>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  const handleAccept = async (url, id, setFunction) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: true, 
          examined: true,
          requested: true  
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to accept request: ${response.status}`);
      }

      setFunction((prevItems) => 
        prevItems.map((item) => 
          item._id === id 
            ? { ...item, status: true, examined: true, requested: true }
            : item
        )
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  async function handleReject(url, id, setFunction) {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: false, 
          examined: true,
          requested: true  
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject request: ${response.status}`);
      }

      setFunction((prevItems) => 
        prevItems.map((item) => 
          item._id === id 
            ? { ...item, status: false, examined: true, requested: true }
            : item
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <Container className="py-2">
      <div className="tab-control">
        <div 
          className={`tab-button ${activeTab === "requests" ? "active" : ""}`} 
          onClick={() => setActiveTab("requests")}
        >
          <span>Requests</span>
          <div className="tab-indicator"></div>
        </div>
        <div 
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`} 
          onClick={() => setActiveTab("orders")}
        >
          <span>Orders</span>
          <div className="tab-indicator"></div>
        </div>
      </div>

      <div className="tab-content">
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          alignItems: "start"
        }}>
          {activeTab === "requests" && requests.map((request, index) =>
            (request.examined || !request.req_description) ? null : (
              <Card 
                key={index}
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
                  {request.user_id?.profileImage ? (
                    <img 
                      src={request.user_id.profileImage} 
                      alt={request.user_id.name} 
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
                      <FaUser color="#9c9f9f" size={24} />
                    </div>
                  )}
                  <h6 className="mb-0" style={{ color: "#333" }}>{request.user_id?.name || "User"}</h6>
                </div>

                <img
                  src={request.prescription_img}
                  alt="prescription"
                  style={{ 
                    width: "100%",
                    height: "200px",
                    objectFit: "cover"
                  }}
                />
                
                <Card.Body className="p-3">
                  <div className="mb-3">
                    <p className="mb-2" style={{ fontSize: '16px', color: '#333' }}>
                      <strong>Name:</strong> {request.req_name}
                    </p>
                    <div
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        fontSize: "14px",
                        color: "#333",
                        maxHeight: "80px",
                        overflowY: "auto"
                      }}
                    >
                      {request.req_description}
                    </div>
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
                      onClick={() => handleAccept(req_url, request._id, setRequests)}
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
                      onClick={() => handleReject(req_url, request._id, setRequests)}
                    >
                      Reject
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )
          )}

          {activeTab === "orders" && orders.map((order, index) =>
            order.examined ? null : (
              <Card 
                key={index}
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
                  {order.user_id?.profileImage ? (
                    <img 
                      src={order.user_id.profileImage} 
                      alt={order.user_id.name} 
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
                      <FaUser color="#9c9f9f" size={24} />
                    </div>
                  )}
                  <h6 className="mb-0" style={{ color: "#333" }}>{order.user_id?.name || "User"}</h6>
                </div>

                <img
                  src={order.prescription_img}
                  alt="prescription"
                  style={{ 
                    width: "100%",
                    height: "200px",
                    objectFit: "cover"
                  }}
                />
                
                <Card.Body className="p-3">
                  <div className="mb-3">
                    <p className="mb-2" style={{ fontSize: '16px', color: '#333' }}>
                      <strong>Name:</strong> {order.req_name}
                    </p>
                    <div
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        fontSize: "14px",
                        color: "#333",
                        maxHeight: "80px",
                        overflowY: "auto"
                      }}
                    >
                      {order.req_description}
                    </div>
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
                      onClick={() => handleAccept(order_url, order._id, setOrders)}
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
                      onClick={() => handleReject(order_url, order._id, setOrders)}
                    >
                      Reject
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )
          )}
        </div>
      </div>
    </Container>
  );
};
