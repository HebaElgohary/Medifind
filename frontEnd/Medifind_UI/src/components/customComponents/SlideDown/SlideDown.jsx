/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useScroll } from "framer-motion";
import styles from "../Post/Post.module.css";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../../customHooks/usePost";
import { useDecoded } from "../../../customHooks/useDecode";
import { FaUser, FaCapsules, FaClock } from "react-icons/fa";
const BASE_URL  = import.meta.env.VITE_BASE_URL;
// import { AIPrescription } from "../AIPrescription/AIPrescription";

export function SlideDown({ Medicine }) {
  const IconComponent = FaUser;
  const decodedToken = useDecoded();
  const navigate = useNavigate();
  const { sendRequest, isLoading } = usePost(`${BASE_URL}/request`);

  const handleRequest = async () => {
    if (!decodedToken) return;

    try {
      const requestData = {
        user_id: decodedToken.id,
        medicine: Medicine._id,
      };

      await sendRequest(requestData);
      navigate("/need");
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  const { scrollYProgress } = useScroll();

  const getExpiryDays = (expireDate) => {
    const today = new Date();
    const expiry = new Date(expireDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      }}
      viewport={{ once: true }}
      style={{
        width: "100%",
      }}
    >
      <main className={styles.post}>
        <div className={styles.imageContainer}>
          <img
            src={
              Medicine.image_path ||
              "https://via.placeholder.com/300x200?text=Medicine"
            }
            alt={Medicine.name}
            className={styles.medicineImage}
          />
          <div className={styles.imageOverlay}></div>

          <div className={styles.quantityBadge}>
            <FaCapsules />
            <span>{Medicine.quantity}</span>
          </div>

          <div className={styles.medicineTitleOverlay}>{Medicine.name}</div>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userImageContainer}>
            {Medicine?.user_id?.profileImage ? (
              <img
                src={Medicine?.user_id?.profileImage}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="h-100 w-100 bg-white d-flex align-items-center justify-content-center">
                <IconComponent color="#00B5B5" size={20} />
              </div>
            )}
          </div>
          <div className={styles.userName}>{Medicine.user_id?.name}</div>
          <div className={styles.aiPrescriptionButton}>
            {/* <AIPrescription /> */}
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.medicineInfo}>
            <FaCapsules />
            <span>{Medicine.concentration}</span>
          </div>

          <div className={styles.medicineInfo}>
            <FaClock />
            <span>{getExpiryDays(Medicine.expire_date)} days left</span>
          </div>

          <button
            className={styles.requestBtn}
            onClick={handleRequest}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Request Medicine"}
          </button>
        </div>
      </main>
    </motion.div>
  );
}
