import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [room, setRoom] = useState({});
  const [user, setUser] = useState(null);
  const [totalamount, setTotalAmount] = useState(0);
  const [totaldays, setTotalDays] = useState(0);

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

  async function bookRoom() {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
    };

    try {
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      // Handle the result as needed
    } catch (error) {
      // Handle the error as needed
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
            <img src={room.imageurls[0]} className="bigimg" alt={room.name} />
          </div>
          <div className="col-md-5">
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
              <button className="btn btn-primary" onClick={bookRoom}>
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
