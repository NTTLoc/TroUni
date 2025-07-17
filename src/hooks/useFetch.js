import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetch = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios(url, options);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
