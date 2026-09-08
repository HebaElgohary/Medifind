import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useDecoded = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isDecoding, setIsDecoding] = useState(true);

  const decodeToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setDecodedToken(null);
      setIsDecoding(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
    } catch (error) {
      console.error("Invalid JWT token", error);
      setDecodedToken(null);
    } finally {
      setIsDecoding(false);
    }
  };

  useEffect(() => {
    decodeToken();

    const handleAuthChange = () => {
      setIsDecoding(true);
      decodeToken();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return {
    decodedToken,
    isDecoding,
  };
};