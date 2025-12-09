import { useState } from 'react';
import axios from 'axios';
import { useDecoded } from './useDecode';

export const useDelete = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const decodedToken = useDecoded();

  const deleteRequest = async (req_id) => {
    setIsLoading(true);
    setServerError(null); // Reset error state before new request
    try {
      if (!decodedToken) {
        throw new Error('User is not authenticated');
      }

      console.log(`${url}/${decodedToken.id}`);
      const response = await axios.delete(`${url}/${decodedToken.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'req_id': req_id
          },
        }

      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Request failed with status ${response.status}: ${response.data.message || 'Unknown error'}`);
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      const errorDetails = {
        status: error.response?.status,
        message: errorMessage,
        details: error.response?.data
      };
      setServerError(errorDetails);
      throw errorDetails;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, serverError, deleteRequest };
};
