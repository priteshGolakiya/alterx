import React from "react";
import styles from "../../styles/components/about/whyus.module.css";
import WhyUsCom from "./WhyUsCom";

function WhyUs() {
  return (
    <div className={styles.container}>
      <div className={styles.imgCon}>
        <img src="/images/12.jpg" alt="" />
      </div>
      <div className={styles.desc}>
        <div>
          <h2>Why Us ?</h2>
        </div>
        <WhyUsCom />
 
          <h4 style={{ textAlign: "end", fontSize: "18px", fontWeight: "750" }}>
            Our Success Depends On Your Success
          </h4>

      </div>
    </div>
  );
}

export default WhyUs;
