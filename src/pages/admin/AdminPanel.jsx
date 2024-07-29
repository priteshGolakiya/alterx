import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/admin/adminPanel.module.css";
import Loader from "../../components/common/Loader";

function AdminPanel() {
  const token = localStorage.getItem("token");
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAdminProducts() {
    try {
      const response = await axios.get(
        "https://alterx-2.onrender.com/product",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdminProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const renderContent = () => {
    if (loading) {
      return Array(6)
        .fill(0)
        .map((_, index) => <Loader key={index} />);
    }

    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    if (adminProducts.length === 0) {
      return <h1>No Products</h1>;
    }

    return adminProducts.map((product) => (
      <div className={styles.container} key={product._id}>
        <div className={styles.imgCon}>
          <img src={product.images[0]} alt={product.name} />
        </div>
        <div className={styles.details}>
          <p>{product.name}</p>
        </div>
      </div>
    ));
  };

  return <div className={styles.outer}>{renderContent()}</div>;
}

export default AdminPanel;
