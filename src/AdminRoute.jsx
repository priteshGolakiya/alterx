import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  if (!token) {
    return navigate("/login");
  } else {
    return <Outlet />;
  }
}

export default AdminRoute;
