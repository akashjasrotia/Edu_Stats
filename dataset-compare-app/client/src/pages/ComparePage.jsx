import { useState, useEffect } from "react";
import CompareView from "../components/CompareView";

export default function ComparePage() {
  const [dataSet1, setDataSet1] = useState(null);
  const [dataSet2, setDataSet2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/data/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return await response.json();
      } catch (err) {
        setError(err.message);
      }
    };

    const loadData = async () => {
      setLoading(true);
      const [data1, data2] = await Promise.all([
        fetchData("dataset1_id"),
        fetchData("dataset2_id"),
      ]);
      setDataSet1(data1);
      setDataSet2(data2);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Compare Data Sets</h1>
      <CompareView dataSet1={dataSet1} dataSet2={dataSet2} />
    </div>
  );
}