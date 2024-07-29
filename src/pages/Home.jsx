import React from "react";
import Carousel from "../components/common/Carousel";
import AboutCom from "../components/about/AboutCom";
import OurServices from "../components/home/OurServices";
// import ManageMent from "../components/home/ManageMent";

function Home() {
  return (
    <div>
      <Carousel
        img1="/images/01.jpg"
        img2="/images/02.jpg"
        img3="/images/03.jpg"
      />
      <AboutCom />
      <OurServices />
      {/* <ManageMent /> */}
    </div>
  );
}

export default Home;
