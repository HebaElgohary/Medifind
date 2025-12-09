import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Toast = () => {
  const [showToast, setShowToast] = useState(true);

  // Animation Variants for Framer Motion
  const toastVariants = {
    hidden: { x: "100vw", opacity: 0 }, 
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 80, damping: 10 } },
    exit: { x: "100vw", opacity: 0, transition: { type: "spring", stiffness: 80, damping: 10 } }
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          className="toast position-fixed top-20 m-4 show shadow-lg"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            zIndex: 1050,
            top: "80px", 
            right: "20px",
            minWidth: "300px",
            background: "white",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <div className="toast-header d-flex justify-content-between align-items-center">
            <strong className="me-auto">🎉 Congratulations</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            The medicine has been added successfully!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

