import React from "react";
import styles from "../../styles/components/home/management.module.css";
import ManagementCard from "./ManagementCard";

function ManageMent() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>
          <p>LEARN MORE</p>
          <h3>Our Management</h3>
        </div>
        <div>
          Each team member is working towards the common goal of providing you
          with the best service possible for any and every need in the
          pharmaceutical industry.
        </div>
      </div>

      {/* management div */}
      <div className={styles.managementCardCon}>
        <ManagementCard />
      </div>
    </div>
  );
}

export default ManageMent;
