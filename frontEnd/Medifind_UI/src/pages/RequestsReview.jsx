import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa";

import "./RequestsReview.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const RequestsReview = () => {
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] =
    useState("requests");

  const [actionLoading, setActionLoading] =
    useState(null);

  const req_url = `${BASE_URL}/request`;
  const order_url = `${BASE_URL}/orders`;

  // =========================
  // Fetch Data
  // =========================

  const fetchData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    return Array.isArray(result?.data)
      ? result.data
      : [];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          requestsData,
          ordersData,
        ] = await Promise.all([
          fetchData(req_url),
          fetchData(order_url),
        ]);

        setRequests(requestsData);
        setOrders(ordersData);
      } catch (error) {
        console.error(
          "Error loading data:",
          error
        );

        setError(
          error.message ||
            "Failed to load data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // =========================
  // Accept
  // =========================

  const handleAccept = async (
    url,
    id,
    setFunction
  ) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${url}/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: true,
            examined: true,
            requested: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to accept request: ${response.status}`
        );
      }

      setFunction((prevItems) =>
        prevItems.map((item) =>
          item._id === id
            ? {
                ...item,
                status: true,
                examined: true,
                requested: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error accepting request:",
        error
      );

      setError(
        error.message ||
          "Failed to accept request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // Reject
  // =========================

  const handleReject = async (
    url,
    id,
    setFunction
  ) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${url}/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: false,
            examined: true,
            requested: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to reject request: ${response.status}`
        );
      }

      setFunction((prevItems) =>
        prevItems.map((item) =>
          item._id === id
            ? {
                ...item,
                status: false,
                examined: true,
                requested: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error rejecting request:",
        error
      );

      setError(
        error.message ||
          "Failed to reject request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "50vh",
        }}
      >
        <Spinner
          animation="border"
          variant="info"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </Spinner>
      </Container>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "50vh",
        }}
      >
        <div className="text-center text-danger">
          <h5>
            Error loading data
          </h5>

          <p>{error}</p>
        </div>
      </Container>
    );
  }

  // =========================
  // Render
  // =========================

  return (
    <Container className="py-2">
      {/* =========================
          Tabs
      ========================= */}

      <div className="tab-control">
        <div
          className={`tab-button ${
            activeTab === "requests"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("requests")
          }
        >
          <span>Requests</span>

          <div className="tab-indicator" />
        </div>

        <div
          className={`tab-button ${
            activeTab === "orders"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("orders")
          }
        >
          <span>Orders</span>

          <div className="tab-indicator" />
        </div>
      </div>

      {/* =========================
          Content
      ========================= */}

      <div className="tab-content">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* =========================
              Requests
          ========================= */}

          {activeTab === "requests" &&
            requests.map((request) => {
              // Don't show examined requests
              if (
                request.examined ||
                !request.req_description
              ) {
                return null;
              }

              return (
                <Card
                  key={request._id}
                  style={{
                    width: "300px",
                    backgroundColor:
                      "#ffffff",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow:
                      "0 4px 8px rgba(0, 0, 0, 0.1)",
                    marginRight: "30px",
                  }}
                  className="mb-3"
                >
                  {/* User */}

                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {request.user_id
                      ?.profileImage ? (
                      <img
                        src={
                          request.user_id
                            .profileImage
                        }
                        alt={
                          request.user_id
                            ?.name ||
                          "User"
                        }
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit:
                            "cover",
                          border:
                            "2px solid #f0f0f0",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          border:
                            "2px solid #f0f0f0",
                        }}
                      >
                        <FaUser
                          color="#9c9f9f"
                          size={24}
                        />
                      </div>
                    )}

                    <h6
                      className="mb-0"
                      style={{
                        color: "#333",
                      }}
                    >
                      {request.user_id
                        ?.name || "User"}
                    </h6>
                  </div>

                  {/* Prescription */}

                  {request.prescription_img && (
                    <img
                      src={
                        request.prescription_img
                      }
                      alt="prescription"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit:
                          "cover",
                      }}
                    />
                  )}

                  <Card.Body className="p-3">
                    <div className="mb-3">
                      <p
                        className="mb-2"
                        style={{
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        <strong>
                          Name:
                        </strong>{" "}
                        {request.req_name}
                      </p>

                      <div
                        style={{
                          backgroundColor:
                            "#f8f9fa",
                          padding: "10px",
                          borderRadius:
                            "8px",
                          marginBottom:
                            "10px",
                          fontSize: "14px",
                          color: "#333",
                          maxHeight: "80px",
                          overflowY:
                            "auto",
                        }}
                      >
                        {
                          request.req_description
                        }
                      </div>
                    </div>

                    {/* Buttons */}

                    <div className="d-flex gap-2">
                      <Button
                        style={{
                          backgroundColor:
                            "#00BCD4",
                          border: "none",
                          flex: 1,
                          padding: "8px",
                          borderRadius:
                            "8px",
                        }}
                        disabled={
                          actionLoading ===
                          request._id
                        }
                        onClick={() =>
                          handleAccept(
                            req_url,
                            request._id,
                            setRequests
                          )
                        }
                      >
                        {actionLoading ===
                        request._id ? (
                          <Spinner
                            size="sm"
                            animation="border"
                          />
                        ) : (
                          "Accept"
                        )}
                      </Button>

                      <Button
                        style={{
                          backgroundColor:
                            "#FF5252",
                          border: "none",
                          flex: 1,
                          padding: "8px",
                          borderRadius:
                            "8px",
                        }}
                        disabled={
                          actionLoading ===
                          request._id
                        }
                        onClick={() =>
                          handleReject(
                            req_url,
                            request._id,
                            setRequests
                          )
                        }
                      >
                        {actionLoading ===
                        request._id ? (
                          <Spinner
                            size="sm"
                            animation="border"
                          />
                        ) : (
                          "Reject"
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

          {/* =========================
              Orders
          ========================= */}

          {activeTab === "orders" &&
            orders.map((order) => {
              // Don't show examined orders
              if (order.examined) {
                return null;
              }

              return (
                <Card
                  key={order._id}
                  style={{
                    width: "300px",
                    backgroundColor:
                      "#ffffff",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow:
                      "0 4px 8px rgba(0, 0, 0, 0.1)",
                    marginRight: "30px",
                  }}
                  className="mb-3"
                >
                  {/* User */}

                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {order.user_id
                      ?.profileImage ? (
                      <img
                        src={
                          order.user_id
                            .profileImage
                        }
                        alt={
                          order.user_id?.name ||
                          "User"
                        }
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit:
                            "cover",
                          border:
                            "2px solid #f0f0f0",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          border:
                            "2px solid #f0f0f0",
                        }}
                      >
                        <FaUser
                          color="#9c9f9f"
                          size={24}
                        />
                      </div>
                    )}

                    <h6
                      className="mb-0"
                      style={{
                        color: "#333",
                      }}
                    >
                      {order.user_id?.name ||
                        "User"}
                    </h6>
                  </div>

                  {/* Prescription */}

                  {order.prescription_img && (
                    <img
                      src={
                        order.prescription_img
                      }
                      alt="prescription"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit:
                          "cover",
                      }}
                    />
                  )}

                  <Card.Body className="p-3">
                    <div className="mb-3">
                      <p
                        className="mb-2"
                        style={{
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        <strong>
                          Name:
                        </strong>{" "}
                        {order.req_name}
                      </p>

                      <div
                        style={{
                          backgroundColor:
                            "#f8f9fa",
                          padding: "10px",
                          borderRadius:
                            "8px",
                          marginBottom:
                            "10px",
                          fontSize: "14px",
                          color: "#333",
                          maxHeight: "80px",
                          overflowY:
                            "auto",
                        }}
                      >
                        {
                          order.req_description
                        }
                      </div>
                    </div>

                    {/* Buttons */}

                    <div className="d-flex gap-2">
                      <Button
                        style={{
                          backgroundColor:
                            "#00BCD4",
                          border: "none",
                          flex: 1,
                          padding: "8px",
                          borderRadius:
                            "8px",
                        }}
                        disabled={
                          actionLoading ===
                          order._id
                        }
                        onClick={() =>
                          handleAccept(
                            order_url,
                            order._id,
                            setOrders
                          )
                        }
                      >
                        {actionLoading ===
                        order._id ? (
                          <Spinner
                            size="sm"
                            animation="border"
                          />
                        ) : (
                          "Accept"
                        )}
                      </Button>

                      <Button
                        style={{
                          backgroundColor:
                            "#FF5252",
                          border: "none",
                          flex: 1,
                          padding: "8px",
                          borderRadius:
                            "8px",
                        }}
                        disabled={
                          actionLoading ===
                          order._id
                        }
                        onClick={() =>
                          handleReject(
                            order_url,
                            order._id,
                            setOrders
                          )
                        }
                      >
                        {actionLoading ===
                        order._id ? (
                          <Spinner
                            size="sm"
                            animation="border"
                          />
                        ) : (
                          "Reject"
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
        </div>
      </div>
    </Container>
  );
};