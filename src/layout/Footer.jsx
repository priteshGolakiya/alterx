import React from "react";
import styles from "../styles/layout/footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Headquarters</h3>
          <p>Anzen Exports</p>
          <div className={styles.contactInfo}>
            <p>
              <i className="fa-solid fa-location-arrow"></i> 33, Gokuldham,
              andada, anklesvar, gujarat, india 393010
            </p>
            <p>
              <i className="fa-solid fa-envelope"></i> info@alterx.in
            </p>
            <p>
              <i className="fa-solid fa-phone"></i> +91 33 24549650
            </p>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/allProducts">Products</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Connect With Us</h3>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Newsletter</h3>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2024 Anzen Exports. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
