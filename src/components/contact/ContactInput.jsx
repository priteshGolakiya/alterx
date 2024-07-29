import React from "react";
import styles from "../../styles/components/contact/contactInput.module.css";

function ContactInput() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form action="#" method="post">
          <div className={styles.formGroup}>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
          <div className={styles.formGroup}>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label for="subject">Subject:</label>
            <textarea id="subject" name="subject" required></textarea>
          </div>
          <div className={styles.formGroup}>
            <button type="submit" value="Submit">
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactInput;
