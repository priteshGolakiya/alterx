import React from "react";
import styles from "../../styles/components/contact/conactCompany.module.css";

function ContactCompany() {
  const data = [
    {
      icon: "fa-solid fa-location-arrow",
      title: "Location",
      desc: "33, Gokuldham, andada, anklesvar, gujarat, india 393010",
    },
    {
      icon: "fa-solid fa-phone",
      title: "Phone",
      desc: "+91 33 24549650",
    },
    {
      icon: "fa-solid fa-envelope",
      title: "Email",
      desc: "info@alterx.in",
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((value, index) => {
        return (
          <div key={index} className={styles.inner}>
            <i className={value.icon}></i>
            <h4>{value.title}</h4>
            <p> {value.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ContactCompany;
