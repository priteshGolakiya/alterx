import React from "react";
import styles from "../../styles/components/common/loader.module.css";

function Loader() {
  return (
    <div className={styles.card}>
      <div className={styles.image}></div>
      <div className={styles.content}>
        <div className={styles.text}></div>
      </div>
    </div>
  );
}

export default Loader;
