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
    <div className="row landing justify-content-center">
      <div
        className="col-md-9 my-auto text-center"
        style={{ borderRight: "5px solid white" }}
        data-aos="fade-up"
      >
        <h2>
          <b>
            <i>Book Haven</i>
          </b>
        </h2>
        <h1>
          "Discover cozy comfort and effortless bookings with us. Your dream
          stay is just a click away. Book now and make every getaway special."
        </h1>
        <Link to="/login">
          <button className="btn landingbtn">Get Started</button>
        </Link>
      </div>
    </div>
  );
}
