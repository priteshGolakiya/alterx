import React from "react";
import styles from "../../styles/components/about/ourMission.module.css";

function OurMission() {
  return (
    <div className={styles.container}>
      <div className={styles.desc}>
        <div>
          <p>OUR</p>
          <h3>Mission, Vision and Values</h3>
        </div>
        <div className={styles.descPara}>
          <p>
            Our vision is to be the most preferred pharmaceutical services
            provider for local and global markets through superior service and
            timely delivery.
          </p>
          <p>
            We are dedicated to provide value added services and solutions to
            our customers.
          </p>
          <p>Integrity. Reliability. Respect. Responsibility. Loyalty.</p>
        </div>
      </div>
      <div className={styles.imgCon}>
        <img src="/images/11.jpg" alt="" />
      </div>
    </div>
  );
}

export default OurMission;
