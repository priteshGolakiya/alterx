import React from "react";

function WhyUsCom() {
  const data = [
    {
      title: "Exceptional service:",
      ans: "We give importance to the quality of service, over quantity.",
    },
    {
      title: "Long-term relationship:",
      ans: "We give importance to the quality of service, over quantity.",
    },
    {
      title: "Dedication:",
      ans: "We give importance to the quality of service, over quantity.",
    },
    {
      title: "Back office support:",
      ans: "We give importance to the quality of service, over quantity.",
    },
    {
      title: "Value-based pricing:",
      ans: "We give importance to the quality of service, over quantity.",
    },
    {
      title: "Teamwork:",
      ans: "We give importance to the quality of service, over quantity.",
    },
  ];
  return (
    <div>
      {data.map((value, index) => {
        return (
          <ul key={index}>
            <li style={{ fontWeight: "500" }}>{value.title}</li>
            <p style={{ marginTop: "5px" }}>{value.ans}</p>
          </ul>
        );
      })}
    </div>
  );
}

export default WhyUsCom;
