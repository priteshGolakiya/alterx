import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/products/allProducts.module.css";
import Loader from "../../components/common/Loader";

function AllProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://alterx-2.onrender.com/product");
      setAllProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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

    if (allProducts.length === 0) {
      return <div className={styles.noProducts}>No products available.</div>;
    }

    return allProducts.map((product) => (
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

export default AllProducts;
