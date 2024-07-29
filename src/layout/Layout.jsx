import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
