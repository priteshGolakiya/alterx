import React from "react";
import styles from "../../styles/components/home/managementCard.module.css";

function ManagementCard() {
  const data = [
    {
      img: "/images/06.jpg",
      name: "Jugal Kishore Jajodia",
      occupation: "Chief Executive Officer",
    },
    {
      img: "/images/07.jpg",
      name: "Manish Jajodia",
      occupation: "President",
    },
    {
      img: "/images/08.jpg",
      name: "Minu Jajodia",
      occupation: "Chief Operating Officer,Operational Head – Herbal",
    },
    {
      img: "/images/09.jpg",
      name: "Nishita Jajodia",
      occupation: "Business Development Manager",
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((value, index) => {
        return (
          <div className={styles.outer}>
            <div key={index} className={styles.inner}>
              <div className={styles.imgCon}>
                <img src={value.img} alt="img" />
              </div>
              <div className={styles.desc}>
                <h3>{value.name}</h3>
                <p>{value.occupation}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ManagementCard;
