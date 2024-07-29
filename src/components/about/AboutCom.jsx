import React from "react";
import styles from "../../styles/components/about/aboutCom.module.css";

function AboutCom() {
  return (
    <div className={styles.container}>
      {/* about div */}
      <div className={styles.aboutCom}>
        <div className={styles.descCon}>
          <p>LEARN MORE</p>
          <h3>About Us</h3>
          <hr color="#FBBD02" style={{ width: "20%" }} />
          <div className={styles.descPara}>
            <p>
              An introduction to Anzen takes us back to the year 1990 when Mr.
              JK Jajodia founded the Anzen Group in Kolkata, India.
            </p>
            <p>
              Since inception, Anzen was involved in domestic trading and export
              of Active Pharmaceutical Ingredients. The Company made use of the
              best of its resources and manpower to strengthen its network with
              the finest manufacturers in India.
            </p>
          </div>
        </div>
        <div className={styles.imgCon}>
          <img src="/images/04.jpg" alt="" />
        </div>
      </div>
      {/* counter div */}
      <div className={styles.counterCom}>
        <div>
          <p className={styles.number}>611</p>
          <p className={styles.intro}>Companies</p>
        </div>
        <div>
          <p className={styles.number}>65</p>
          <p className={styles.intro}>Countries</p>
        </div>
        <div>
          <p className={styles.number}>33</p>
          <p className={styles.intro}>Years Of Experience</p>
        </div>
      </div>
    </div>
  );
}

export default AboutCom;
