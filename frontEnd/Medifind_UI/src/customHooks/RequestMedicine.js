// hooks/useMedicineForm.js
import axios from "axios";
import { useState } from "react";

const useMedicineForm = () => {
  const [img_path, setPath] = useState('')
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "medifined");
    formData.append("cloud_name", "doxyvufkz");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData
      );

      console.log(response.data.secure_url);
      setPath(response.data.secure_url);
      // Update formData with the image URL
      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
};
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Only letters and spaces are allowed";
    }

    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    handleUpload,
    // handleDrop,
    validateForm,
    setFormData,
  };
};

export default useMedicineForm;
