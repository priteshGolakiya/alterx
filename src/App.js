import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import EventsGallery from "./pages/EventsGallery";
import AllProucts from "./pages/products/AllProucts";
import Plastic from "./pages/products/Plastic";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminRoute from "./AdminRoute";
import AdminPanel from "./pages/admin/AdminPanel";
// import Product from "./pages/admin/Product";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/eventsGallery" element={<EventsGallery />} />
          <Route path="/allProducts" element={<AllProucts />} />
          <Route path="/plastic" element={<Plastic />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* admin panel */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
            {/* <Route path="/admin/product" element={<Product />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
