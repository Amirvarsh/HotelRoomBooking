import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [room, setRoom] = useState({});
  const [user, setUser] = useState(null);
  const [totalamount, setTotalAmount] = useState(0);
  const [totaldays, setTotalDays] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalamount === "") {
      alert("Please enter amount");
    } else {
      var options = {
        key: process.env.REACT_APP_RZP_KEY,
        key_secret: process.env.REACT_APP_RZP_KEY_SECRET,
        amount: totalamount * 100,
        currency: "INR",
        name: user.name,
        description: "Room Booking",
        handler: function (response) {
          onToken(response);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phonenumber,
        },
        notes: {
          address: {
            name: user.name,
            email: user.email,
            phonenumber: user.phonenumber,
          },
        },
        theme: {
          color: "#3399cc",
        },
      };
      var pay = window.Razorpay(options);
      pay.open();
    }
  };

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

  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      token,
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
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
        window.location.href = "/home";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Sorry!", "Something went wrong", "error");
    }
  }

  return (
    <div className="m-5" style={{ padding: "30px " }}>
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
              <button className="btn btn-primary" onClick={handleSubmit}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
