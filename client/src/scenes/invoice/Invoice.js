import React from "react";
import backgroundImage from "assets/background.jpg";

export default function Invoice() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        width: window.innerWidth,
        height: window.innerHeight,
      }}>
      Hello
    </div>
  );
}
