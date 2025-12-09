/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./signup.module.css";
import { Registration } from "../../components/registration/registeration";
import humanty from "../../assets/humanty.jpg";
import loge from "../../assets/medi3.png";

export const SignUp = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const calculateMovement = (axis, factor = 0.02) => {
    const centerPoint = axis === "x" ? dimensions.width / 2 : dimensions.height / 2;
    const currentPoint = axis === "x" ? mousePosition.x : mousePosition.y;
    return (currentPoint - centerPoint) * factor;
  };

  return (
    <div className={styles.signupContainer}>
      {/* Background */}
      {/* 
      <div className={styles.background}>
        <img src={humanty} alt="Medical background" className={styles.bgImage} />
        <div className={styles.overlay}></div>
      </div> 
      */}

      {/* Main Card */}
      <motion.div 
        className={styles.mainCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          transform: `perspective(1000px) rotateX(${calculateMovement("y")}deg) rotateY(${-calculateMovement("x")}deg)`
        }}
      >
        <div className={styles.cardContent}>
          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.brandHeader}>
              {/* 
              <div className={styles.title}>
                Medi
                <div 
                  style={{ 
                    transform: `rotateY(${calculateMovement("x") * 2}deg) rotateX(${calculateMovement("y") * 2}deg)`
                  }}
                >
              */}
                  <img src={loge} alt="Logo" className={styles.logoImage} />
              {/* 
                </div>
                find
              </div> 
              */}
              <h2 className={styles.tagline}>Join our healthcare community</h2>
              <div className={styles.typingText}>Donate & request medicines with ease</div>
            </div>
            
            <div className={styles.formWrapper}>
              <Registration />
            </div>
          </div>
          
          {/* Image Section with CTA */}
          <div className={styles.imageSection}>
            <div className={styles.imageQuote}>
              <div className={styles.quoteIcon}>"</div>
              <h3>Making healthcare accessible to everyone</h3>
              <p>
                Join thousands of users who are already making a difference by 
                donating unused medicines to those who need them most.
              </p>
            </div>
            
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>5K+</span>
                <span className={styles.statLabel}>Donations</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Users</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className={styles.circleDecor1}></div>
        <div className={styles.circleDecor2}></div>
        <div className={styles.circleDecor3}></div>
      </motion.div>
    </div>
  );
};
