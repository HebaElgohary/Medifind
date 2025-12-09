import { useState } from 'react';
import axios from 'axios';

export const useGet = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    const getRequest = async () => {
        setIsLoading(true);
        setServerError(null); // Reset error state before new request

        try {
            const response = await axios.get(url);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`Request failed with status ${response.status}: ${response.data.message || 'Unknown error'}`);
            }

            setData(response.data.data);
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

    return { data, isLoading, serverError, getRequest };
};
