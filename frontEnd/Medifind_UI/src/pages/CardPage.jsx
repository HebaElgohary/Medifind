import { useState, useEffect } from "react";

import {
  Row,
  Col,
  Container,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { useDecoded } from "../customHooks/useDecode";
import { useDelete } from "../customHooks/useDelete";
import { CardNeeds } from "../components/customComponents/CardNeeds";
import { Loader } from "../components/customComponents/Loader/Loader";

import "./CardPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const CardPage = () => {
  /*
    ============================
    State
    ============================
  */

  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeTab, setActiveTab] =
    useState("requests");

  const [isLoading, setIsLoading] =
    useState(true);

  /*
    ============================
    Navigation
    ============================
  */

  const navigate = useNavigate();

  /*
    ============================
    Authentication
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

  const req_Url = `${BASE_URL}/request`;
  const order_Url = `${BASE_URL}/orders`;

  /*
    ============================
    Delete Hooks
    ============================
  */

  const requestDelete =
    useDelete(req_Url);

  const orderDelete =
    useDelete(order_Url);

  /*
    ============================
    Fetch Requests / Orders
    ============================
  */

  const fetchRequests = async (
    url,
    setFunction
  ) => {
    if (!userId) {
      return [];
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${url}/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} - ${response.statusText}`
        );
      }

      const result =
        await response.json();

      const data =
        Array.isArray(result?.data)
          ? result.data
          : [];

      setFunction(data);

      console.log(
        `Fetched data from ${url}:`,
        data
      );

      return data;
    } catch (error) {
      console.error(
        "Fetch error:",
        error
      );

      setFunction([]);

      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /*
    ============================
    Fetch User Data
    ============================
  */

  useEffect(() => {
    if (isDecoding || !userId) {
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        await Promise.all([
          fetchRequests(
            req_Url,
            setRequests
          ),
          fetchRequests(
            order_Url,
            setOrders
          ),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [
    userId,
    isDecoding,
  ]);

  /*
    ============================
    Delete Handler
    ============================
  */

  const handleRemove = async (
    url,
    deleteId,
    setFunction
  ) => {
    try {
      if (url === req_Url) {
        await requestDelete.deleteRequest(
          deleteId
        );
      } else if (url === order_Url) {
        await orderDelete.deleteRequest(
          deleteId
        );
      }

      /*
        Update UI directly
        instead of refetching
      */

      setFunction(
        (prevItems) =>
          prevItems.filter(
            (item) =>
              item._id !== deleteId
          )
      );

      console.log(
        "Item deleted successfully"
      );
    } catch (error) {
      console.error(
        "Failed to delete item:",
        error
      );
    }
  };

  /*
    ============================
    Go To Request Medicine
    ============================
  */

  const goToRequestMedicine = (
    name,
    medicine_id,
    request_id
  ) => {
    navigate("/RequestMedicine", {
      state: {
        medicineName: name,
        medicine_id,
        request_id,
        requested: true,
      },
    });
  };

  /*
    ============================
    Go To Update Request
    ============================
  */

  const goToUpdateRequest = (
    request_id,
    url,
    name,
    image
  ) => {
    navigate(
      `/UpdateRequest/${request_id}`,
      {
        state: {
          request_id,
          requested: true,
          url,
          name,
          image,
        },
      }
    );
  };

  /*
    ============================
    Handle Tab Change
    ============================
  */

  const handleTabChange = async (
    tab
  ) => {
    setActiveTab(tab);

    /*
      We already fetch both
      tabs on initial load.

      But if the selected tab
      has no data, we can fetch
      it again.
    */

    if (tab === "requests") {
      if (requests.length === 0) {
        await fetchRequests(
          req_Url,
          setRequests
        );
      }
    }

    if (tab === "orders") {
      if (orders.length === 0) {
        await fetchRequests(
          order_Url,
          setOrders
        );
      }
    }
  };

  /*
    ============================
    Loading Token
    ============================
  */

  if (isDecoding) {
    return <Loader />;
  }

  /*
    ============================
    Authentication Check
    ============================
  */

  if (!userId) {
    return (
      <Container className="text-center mt-5">
        <h3>
          Please login first
        </h3>
      </Container>
    );
  }

  /*
    ============================
    UI
    ============================
  */

  return (
    <Container className="card-page-container">

      {/* ==========================
          Tabs
      ========================== */}

      <div className="tab-control">

        {/* Requests Tab */}

        <div
          className={`tab-button ${
            activeTab === "requests"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleTabChange(
              "requests"
            )
          }
        >
          <span>
            My Requests
          </span>

          <div className="tab-indicator"></div>
        </div>

        {/* Orders Tab */}

        <div
          className={`tab-button ${
            activeTab === "orders"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleTabChange(
              "orders"
            )
          }
        >
          <span>
            My Orders
          </span>

          <div className="tab-indicator"></div>
        </div>

      </div>

      {/* ==========================
          Tab Content
      ========================== */}

      <div className="tab-content">

        {/* ========================
            Requests
        ======================== */}

        <div
          className={`tab-pane ${
            activeTab === "requests"
              ? "active"
              : ""
          }`}
        >
          {isLoading ? (
            <Loader />
          ) : requests.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No Requests Found
              </h3>

              <p>
                You haven&apos;t made
                any medicine requests
                yet.
              </p>

            </div>
          ) : (
            <Row>
              {requests.map(
                (item) => (
                  <Col
                    key={item._id}
                    xs={12}
                    md={6}
                    lg={4}
                    className="mb-4"
                  >
                    <CardNeeds
                      requested={
                        item.requested
                      }

                      medicine_id={
                        item.medicine?._id
                      }

                      examined={
                        item.examined
                      }

                      status={
                        item.status
                      }

                      request_id={
                        item._id
                      }

                      prescription_img={
                        item.prescription_img ||
                        ""
                      }

                      image={
                        item.medicine
                          ?.image_path ||
                        ""
                      }

                      name={
                        item.req_name ||
                        item.medicine
                          ?.name ||
                        "No name"
                      }

                      concentration={
                        item.medicine
                          ?.concentration ||
                        ""
                      }

                      onRemove={() =>
                        handleRemove(
                          req_Url,
                          item._id,
                          setRequests
                        )
                      }

                      goToRequestMedicine={() =>
                        goToRequestMedicine(
                          item.medicine
                            ?.name,

                          item.medicine
                            ?._id,

                          item._id
                        )
                      }

                      goToUpdateRequest={() =>
                        goToUpdateRequest(
                          item._id,
                          req_Url,
                          item.req_name ||
                            item.medicine
                              ?.name ||
                            "No name",
                          item.prescription_img ||
                            item.medicine
                              ?.image_path ||
                            ""
                        )
                      }
                    />
                  </Col>
                )
              )}
            </Row>
          )}
        </div>

        {/* ========================
            Orders
        ======================== */}

        <div
          className={`tab-pane ${
            activeTab === "orders"
              ? "active"
              : ""
          }`}
        >
          {isLoading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                🛒
              </div>

              <h3>
                No Orders Found
              </h3>

              <p>
                You haven&apos;t placed
                any medicine orders yet.
              </p>

            </div>
          ) : (
            <Row>
              {orders.map(
                (order) => (
                  <Col
                    key={order._id}
                    xs={12}
                    md={6}
                    lg={4}
                    className="mb-4"
                  >
                    <CardNeeds
                      image={
                        order.prescription_img ||
                        ""
                      }

                      name={
                        order.req_name ||
                        "No name"
                      }

                      onRemove={() =>
                        handleRemove(
                          order_Url,
                          order._id,
                          setOrders
                        )
                      }

                      requested={
                        order.requested
                      }

                      examined={
                        order.examined
                      }

                      status={
                        order.status
                      }

                      goToRequestMedicine={() =>
                        goToRequestMedicine(
                          order.req_name,
                          order.medicine
                            ?._id,
                          order._id
                        )
                      }

                      goToUpdateRequest={() =>
                        goToUpdateRequest(
                          order._id,
                          order_Url,
                          order.req_name,
                          order.prescription_img ||
                            ""
                        )
                      }

                      isOrder={true}
                    />
                  </Col>
                )
              )}
            </Row>
          )}
        </div>

      </div>
    </Container>
  );
};