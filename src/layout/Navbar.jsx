import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/layout/navbar.module.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logoLink}>
          <img
            src="https://res.cloudinary.com/dlbflgtdr/image/upload/v1722229864/alterx/ssum7oqx8jahiwgytilw.png"
            alt="Company Logo"
            className={styles.logo}
          />
        </Link>

        <div
          className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuIcon}></span>
        </div>

        <ul className={`${styles.navMenu} ${isMenuOpen ? styles.active : ""}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/allProducts">All Products</Link>
          </li>
          <li>
            <Link to="/eventsGallery">Events & Gallery</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
