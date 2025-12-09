/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDecoded } from "../customHooks/useDecode";
import { useDelete } from "../customHooks/useDelete";
import { CardNeeds } from "../components/customComponents/CardNeeds";
import { BASE_URL } from "../config.js";
import "./CardPage.css";

export const CardPage = () => {

  
  const baseUrl = BASE_URL;
  
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  console.log("🚀 ~ CardPage ~ orders:", orders)
  const [activeTab, setActiveTab] = useState("requests");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const decodedToken = useDecoded();
  const req_Url = `${baseUrl}/request`;
  const order_Url =`${baseUrl}/orders`;

  // Initialize delete hooks for each endpoint at the top level.
  const requestDelete = useDelete(req_Url);
  const orderDelete = useDelete(order_Url);
  
  // Helper function to fetch requests (or orders) 
  const fetchRequests = async (url, setFunction) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/${decodedToken.id}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();
      const data = result.data || [];
      setFunction(data);
      console.log(`Fetched data from ${url}:`, data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      setFunction([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (decodedToken) {
      // Fetch data for both tabs when component mounts
      const fetchAllData = async () => {
        await fetchRequests(req_Url, setRequests);
        await fetchRequests(order_Url, setOrders);
      };
      
      fetchAllData();
    }
  }, [decodedToken]);

  // Delete handler for both requests and orders.
  const handleRemove = async (url, del_id, setFunction) => {
    try {
      if (url === req_Url) {
        await requestDelete.deleteRequest(del_id);
      } else if (url === order_Url) {
        await orderDelete.deleteRequest(del_id);
      }
      
      // Update state directly instead of refetching
      setFunction(prevItems => prevItems.filter(item => item._id !== del_id));
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Navigation function that passes required state
  const goToRequestMedicine = (name, medicine_id, request_id) => {
    navigate("/RequestMedicine", {
      state: { medicineName: name, medicine_id, request_id, requested: true },
    });
  };
  
  const goToUpdateRequest = (request_id, url , name,image ) => {
    navigate(`/UpdateRequest/${request_id}`, {
      state: { request_id, requested: true, url,name,image },
    });
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Ensure data is loaded for the selected tab
    if (tab === "requests" && requests.length === 0) {
      fetchRequests(req_Url, setRequests);
    } else if (tab === "orders" && orders.length === 0) {
      fetchRequests(order_Url, setOrders);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <Container className="card-page-container">
      <div className="tab-control">
        <div 
          className={`tab-button ${activeTab === "requests" ? "active" : ""}`} 
          onClick={() => handleTabChange("requests")}
        >
          <span>My Requests</span>
          <div className="tab-indicator"></div>
        </div>
        <div 
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`} 
          onClick={() => handleTabChange("orders")}
        >
          <span>My Orders</span>
          <div className="tab-indicator"></div>
        </div>
      </div>

      <div className="tab-content">
        {/* Requests Tab */}
        <div className={`tab-pane ${activeTab === "requests" ? "active" : ""}`}>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Requests Found</h3>
              <p>You haven&apos;t made any medicine requests yet.</p>
            </div>
          ) : (
            <Row>
              {requests.map((item) => (
                <Col key={item._id} xs={12} md={6} lg={4} className="mb-4">
                  <CardNeeds
                    requested={item.requested}
                    medicine_id={item.medicine?._id}
                    examined={item.examined}
                    status={item.status}
                    request_id={item._id}
                    prescription_img={item.prescription_img || ""}
                    image={item.medicine?.image_path || ""}
                    name={item.req_name || item.medicine?.name || "No name"}
                    concentration={item.medicine?.concentration || ""}
                    onRemove={() => handleRemove(req_Url, item._id, setRequests)}
                    goToRequestMedicine={() => 
                      goToRequestMedicine(
                        item.medicine?.name, 
                        item.medicine?._id, 
                        item._id
                      )
                    }
                    goToUpdateRequest={() => 
                      goToUpdateRequest(item._id, req_Url)
                    }
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Orders Tab */}
        <div className={`tab-pane ${activeTab === "orders" ? "active" : ""}`}>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>No Orders Found</h3>
              <p>You haven&apos;t placed any medicine orders yet.</p>
            </div>
          ) : (
            <Row>
              {orders.map((order) => (
                <Col key={order._id} xs={12} md={6} lg={4} className="mb-4">
                  <CardNeeds
                    image={order.prescription_img || ""}
                    name={order.req_name || "No name"}
                    onRemove={() => handleRemove(order_Url, order._id, setOrders)}
                    requested={order.requested}
                    examined={order.examined}
                    status={order.status}
                    goToRequestMedicine={() => goToRequestMedicine(order.req_name, order.medicine._id, order._id)}
                    goToUpdateRequest={() => goToUpdateRequest(order._id, order_Url, order.req_name,order.prescription_img)}
                    isOrder={true}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </Container>
  );
};
