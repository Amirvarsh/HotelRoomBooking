import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import StripeCheckout from "react-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import Swal from "sweetalert2";

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [room, setRoom] = useState({});
  const [user, setUser] = useState(null);
  const [totalamount, setTotalAmount] = useState(0);
  const [totaldays, setTotalDays] = useState(0);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchRoomById = async () => {
      try {
        setError(null);
        setLoading(true);

        const response = await axios.post("/api/rooms/getroombyid", {
          roomid,
        });

        if (response.data && response.data.name) {
          setRoom(response.data);
        } else {
          setError("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        setError("Error fetching room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomById();
  }, [roomid]);

  useEffect(() => {
    // Calculate total amount and total days when fromdate or todate changes
    const calculateTotalValues = () => {
      const days = moment(todate, "DD-MM-YYYY").diff(
        moment(fromdate, "DD-MM-YYYY"),
        "days"
      );
      setTotalDays(days + 1); // Adding 1 to include the last day

      const amount = room.rentperday * (days + 1);
      setTotalAmount(amount);
    };

    calculateTotalValues();
  }, [fromdate, todate, room.rentperday]);

  useEffect(() => {
    // Load Stripe
    const loadStripeObject = async () => {
      const stripeObj = await loadStripe(
        "pk_test_51OQZ27SDA4LzPuFd43u9a7MEeSB1WL2YThut5MfKwUrBcM8QkSoFVRvNkeF2Ai0BahIpCypkQM0JsVUlrHjr3K6W00EgSuMVru"
      );
      setStripe(stripeObj);
    };

    loadStripeObject();
  }, []);

  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/bookings";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Sorry!", "Something went wrong", "error");
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} />
      ) : (
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} className="bigimg img-fluid" alt="" />
          </div>
          <div className="col-md-6">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {user ? user.name : "Guest"}</p>
                <p>
                  From Date:{" "}
                  {moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY")}
                </p>
                <p>
                  To Date: {moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY")}
                </p>
                <p>Max members Count: {room.maxcount}</p>
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <b>
                <h1>Amount</h1>
                <hr />
                <p>Total Days: {totaldays}</p>
                <p>Rent per Day: {room.rentperday}</p>
                <p>Total Amount: {totalamount}</p>
              </b>
            </div>
            <div style={{ float: "right" }}>
              <StripeCheckout
                amount={totalamount * 100}
                currency="INR"
                token={onToken}
                stripeKey="pk_test_51OQZ27SDA4LzPuFd43u9a7MEeSB1WL2YThut5MfKwUrBcM8QkSoFVRvNkeF2Ai0BahIpCypkQM0JsVUlrHjr3K6W00EgSuMVru"
              >
                <button className="btn btn-primary">Pay Now</button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
