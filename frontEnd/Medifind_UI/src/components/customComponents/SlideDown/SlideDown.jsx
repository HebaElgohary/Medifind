/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { motion, useScroll } from "framer-motion";
import styles from "../Post/Post.module.css";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../../customHooks/usePost";
import { useDecoded } from "../../../customHooks/useDecode";
import {
  FaUser,
  FaCapsules,
  FaClock,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// import { AIPrescription } from "../AIPrescription/AIPrescription";

export function SlideDown({ Medicine }) {
  const IconComponent = FaUser;

  const {
    decodedToken,
    isDecoding,
  } = useDecoded();

  const navigate = useNavigate();

  const {
    sendRequest,
    isLoading,
  } = usePost(`${BASE_URL}/request`);

  // =========================
  // Handle Request
  // =========================

  const handleRequest = async () => {
    if (isDecoding || !decodedToken?.id) {
      return;
    }

    try {
      const requestData = {
        user_id: decodedToken.id,
        medicine: Medicine?._id,
      };

      await sendRequest(requestData);

      navigate("/need");
    } catch (error) {
      console.error(
        "Failed to send request:",
        error
      );
    }
  };

  // =========================
  // Scroll Animation
  // =========================

  const { scrollYProgress } = useScroll();

  // =========================
  // Calculate Expiry Days
  // =========================

  const getExpiryDays = (expireDate) => {
    const today = new Date();
    const expiry = new Date(expireDate);

    const diffTime = expiry - today;

    const diffDays = Math.ceil(
      diffTime /
        (1000 * 60 * 60 * 24)
    );

    return diffDays;
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      }}
      viewport={{
        once: true,
      }}
      style={{
        width: "100%",
      }}
    >
      <main className={styles.post}>
        {/* =========================
            Medicine Image
        ========================= */}

        <div className={styles.imageContainer}>
          <img
            src={
              Medicine?.image_path ||
              "https://via.placeholder.com/300x200?text=Medicine"
            }
            alt={Medicine?.name || "Medicine"}
            className={styles.medicineImage}
          />

          <div
            className={styles.imageOverlay}
          />

          <div
            className={styles.quantityBadge}
          >
            <FaCapsules />

            <span>
              {Medicine?.quantity}
            </span>
          </div>

          <div
            className={
              styles.medicineTitleOverlay
            }
          >
            {Medicine?.name}
          </div>
        </div>

        {/* =========================
            User Info
        ========================= */}

        <div className={styles.userInfo}>
          <div
            className={
              styles.userImageContainer
            }
          >
            {Medicine?.user_id
              ?.profileImage ? (
              <img
                src={
                  Medicine.user_id
                    .profileImage
                }
                alt={
                  Medicine.user_id
                    ?.name || "User"
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div className="h-100 w-100 bg-white d-flex align-items-center justify-content-center">
                <IconComponent
                  color="#00B5B5"
                  size={20}
                />
              </div>
            )}
          </div>

          <div className={styles.userName}>
            {Medicine?.user_id?.name ||
              "User"}
          </div>

          <div
            className={
              styles.aiPrescriptionButton
            }
          >
            {/* <AIPrescription /> */}
          </div>
        </div>

        {/* =========================
            Medicine Info
        ========================= */}

        <div
          className={styles.contentContainer}
        >
          <div
            className={styles.medicineInfo}
          >
            <FaCapsules />

            <span>
              {Medicine?.concentration}
            </span>
          </div>

          <div
            className={styles.medicineInfo}
          >
            <FaClock />

            <span>
              {getExpiryDays(
                Medicine?.expire_date
              )}{" "}
              days left
            </span>
          </div>

          {/* =========================
              Request Button
          ========================= */}

          {decodedToken?.role
            ?.toLowerCase() === "user" && (
            <button
              className={styles.requestBtn}
              onClick={handleRequest}
              disabled={
                isLoading || isDecoding
              }
            >
              {isLoading
                ? "Processing..."
                : "Request Medicine"}
            </button>
          )}
        </div>
      </main>
    </motion.div>
  );
}