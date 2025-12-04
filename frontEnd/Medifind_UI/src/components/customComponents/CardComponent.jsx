// import React from "react";
import { Card } from "react-bootstrap";
import { AddBtn } from "./Addbtn";

export const CardComponent = ({
  image,
  prescription_img,
  name,
  quantity,
  onRemove,
  request_id,
  medicine_id,
  examined,
  status,
  setRequested,
  requested,
  goToRequestMedicine,
}) => {
  const bgColor = requested
    ? !examined
      ? "#d9dedc"
      : status
      ? "#bef5be"
      : "#f9c8c1"
    : "#f4fcf9";

  return (
    <Card
      style={{
        // backgroundColor: "#E6F5EF",
        backgroundColor: bgColor,

        borderRadius: "10px",
        padding: "10px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out",
      }}
      className="mb-3"
    >
      <div className="row g-0">
        <div className="col-4 d-flex align-items-center justify-content-center">
          <img
            src={image}
            alt={name}
            style={{
              borderRadius: "5px",
              maxWidth: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="col-8">
          <Card.Body>
            <Card.Title
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Name: {name}
            </Card.Title>
            <div className="d-flex align-items-center mt-2">
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {quantity}
              </span>
            </div>
            {/* Only display "Check out" button if not requested */}
            {!requested && !examined && !status && (
              <AddBtn
                onClick={goToRequestMedicine}
                className="ms-auto d-block"
                style={{
                  backgroundColor: "#109d89",
                  border: "none",
                  fontSize: "18px",
                  width: "60%",
                  marginRight: "150px",
                  marginTop: "10px",
                }}
              >
                Check out
              </AddBtn>
            )}
            {requested && !status && !examined && (
              <p className="text-muted" style={{ fontSize: "16px" }}>
                status :<b> waiting for approval</b>
              </p>
            )}
            {requested && examined && status && (
              <p style={{ color: "green" }}>
                status : <b>Accepted</b>
              </p>
            )}
            {requested && examined && !status && (
              <p style={{ color: "red" }}>
                status : <b>Rejected</b>
              </p>
            )}
            <AddBtn
              onClick={onRemove}
              style={{
                backgroundColor: "#ca1e0f",
                border: "none",
                width: "60%",
                marginTop: "10px",
              }}
            >
              Remove
            </AddBtn>
          </Card.Body>
        </div>
      </div>
    </Card>
  );
};
