import React from "react";
import styles from "../../styles/components/common/carousel.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Carousel({ img1, img2, img3 }) {
  var settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 2000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <Slider {...settings}>
      <div className={styles.mainContainer}>
        <img src={img1} alt="img1" />
      </div>
      <div className={styles.mainContainer}>
        <img src={img2} alt="img2" />
      </div>
      <div className={styles.mainContainer}>
        <img src={img3} alt="img3" />
      </div>
    </Slider>
  );
}

export default Carousel;
