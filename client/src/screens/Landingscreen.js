import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";

export default function Landingscreen() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.AOS.init({
        duration: 800,
        easing: "ease-in-out",
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div class="container-fluid">
      <div
        className="row landing justify-content-center parallax-effect "
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/bgimg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              animation: "firing 1s ease-out", // Apply the firing animation
              color: " #FFFF00 ", // Set the color to yellow
              textShadow: "0 0 10px rgba(255, 255, 0, 0.5)",
              fontFamily: "sans-serif",
              fontSize: "4.5rem",
              fontWeight: "normal",
              fontStyle: "italic",
            }}
          >
            SR SPRING RESIDENCY
          </h2>
        </div>

        <div
          className="col-md-9 my-auto text-center"
          style={{
            border: "5px solid white",
            padding: "0 5px", // Adjust the padding to reduce space
            background: "rgba(255, 255, 255, 0.5)", // Apply a semi-transparent white background
            borderRadius: "10px", // Add border radius to create a curved shape
          }}
          data-aos="fade-up"
        >
          <h1
            style={{
              color: " #654321 ",
              fontWeight: "bold",
              fontSize: "2rem",
              fontStretch: "extra-expanded",
              fontStyle: "italic",
            }}
          >
            <br />
            Discover cozy comfort and effortless bookings with us
            <br />
            Your dream stay is just a click away
          </h1>
          <Link to="/login">
            <button className="btn landingbtn"> Book Now ! </button>
          </Link>
          <br />
          <br />

          <h3>
            <b>0123-23452524</b> <br />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              📞 Call Us to Book Now
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
