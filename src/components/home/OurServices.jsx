import React from "react";
import styles from "../../styles/components/home/ourServices.module.css";
import { useNavigate } from "react-router-dom";

function OurServices() {
  const navigate = useNavigate();

  function handleContact() {
    navigate("/contact");
  }
  return (
    <div className={styles.container}>
      {/* go to contact  */}
      <div className={styles.goToContact}>
        <div className={styles.descContact}>
          <p>contact us & learn more about us</p>
          <h3>Explore our full range of products.</h3>
        </div>
        <div className={styles.btnCon}>
          <button onClick={handleContact}>Contact Us</button>
          <button>Our Latest Brochure</button>
        </div>
      </div>
      {/*  services */}
      <div className={styles.servicesCom}>
        <div className={styles.offer}>
          <div>
            <p>WHAT WE OFFER</p>
            <h3>Our Company Services</h3>
            <hr />
          </div>
          <div>
            Anzen Exports is vertically integrated in the healthcare industry.
            Our group companies engage in various services including
          </div>
        </div>
        <div className={styles.iconWithDesc}>
          <div>
            <i className="fa-solid fa-bolt"></i>
            <p>Developing Nutraceutical and Nutri Cosmetic Formulations</p>
          </div>
          <div>
            <i className="fa-solid fa-scale-unbalanced-flip"></i>
            <p>Manufacturing of Finished Dosage Formulations</p>
          </div>
          <div>
            <i className="fa-solid fa-droplet"></i>
            <p>Trading in APIs, Herbal, Nutraceutical, Cosmetic Ingredients</p>
          </div>
          <div>
            <i className="fa-solid fa-grip-vertical"></i>
            <p>
              Selling Nutraceutical OTC and Rx products under our brand name,
              Nutrite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurServices;
