import React from "react";
import ContactCompany from "../components/contact/ContactCompany";
import ContactInput from "../components/contact/ContactInput";

function Contact() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <ContactCompany />
      <ContactInput />
    </div>
  );
}

export default Contact;
