import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [totalPage, setTotalPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setTotalPage(null);
      setIsLoading(false);
      setServerError(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setServerError(null);

      try {
        const response = await axios.get(url);

        setTotalPage(response.data?.totalPage);

        setData(
          response.data?.data ?? response.data
        );
      } catch (error) {
        setServerError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    data,
    totalPage,
    isLoading,
    serverError,
  };
};