import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [totalPage,setTotalPage]=useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    // Don't fetch if URL is null or undefined
    if (!url) {
      setData(null);
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(url);
        console.log('API Response:', response.data);
        setTotalPage(response.data?.totalPage);
        
        // Handle different response formats
        if (response.data?.data) {
          // If data is nested in a 'data' property
          setData(response.data.data);
        } else {
          // If data is directly in the response
          setData(response.data);
        }

      } catch (error) {
        setServerError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, totalPage, isLoading, serverError };
};

;
