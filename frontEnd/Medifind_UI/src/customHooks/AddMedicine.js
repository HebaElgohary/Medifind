import { useState } from "react";

export const useAddMedicineForm = () => {
  const [medicineName, setMedicineName] = useState("");
  const [numPieces, setNumPieces] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [concentration, setConcentration] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    // Medicine name validation
    if (!medicineName.trim()) {
      newErrors.medicineName = "Medicine name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(medicineName.trim())) {
      newErrors.medicineName = "Only letters are allowed.";
    }

    // Number of pieces validation
    if (!numPieces) {
      newErrors.numPieces = "Number of pieces is required.";
    } else if (!/^\d+$/.test(String(numPieces))) {
      newErrors.numPieces = "Only numbers are allowed.";
    }

    // Expire date validation
    if (!expireDate) {
      newErrors.expireDate = "Expire date is required.";
    } else {
      const selectedDate = new Date(expireDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.expireDate = "Expire date must be in the future.";
      }
    }

    // Concentration validation
    if (!concentration?.trim()) {
      newErrors.concentration = "Concentration is required.";
    } else if (!/^\d+\s?(mg|g|ml|mcg|kg)$/i.test(concentration.trim())) {
      newErrors.concentration = "Invalid format (e.g., 100 mg).";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    medicineName,
    numPieces,
    expireDate,
    concentration,
    errors,
    setMedicineName,
    setNumPieces,
    setExpireDate,
    setConcentration,
    setImage,
    validateForm,
  };
};
