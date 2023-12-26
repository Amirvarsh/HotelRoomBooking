import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Divider, Space, Tag } from 'antd';

const { TabPane } = Tabs;

const ProfileContent = ({ user }) => (
  <div className="text-left bs">
    <div className="row-fluid mr-3">
      <div className="col-md-6">
        <h1>My Profile</h1>
        <br />
        <h1>Name: {user.name}</h1>
        <h1>Email: {user.email}</h1>
        <h1>isAdmin: {user.isAdmin ? "YES" : "NO"}</h1>
      </div>
    </div>
  </div>
);

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <i>
          <b>Profile</b>
        </i>
      ),
      content: <ProfileContent user={user} />,
    },
    {
      key: "2",
      label: (
        <b>
          <i>Bookings</i>
        </b>
      ),
      content: <MyBookings user={user} />,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div className="ml-3 mt-3 mr-3">
      <Tabs defaultActiveKey="1" onChange={onChange}>
        {items.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default Profilescreen;

export function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchBookings();
  }, [user._id]);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);

      const result = await axios.post("/api/bookings/cancelbooking", {
        bookingid,
        roomid,
      });
      console.log(result.data);
      setLoading(false);
      Swal.fire(
        "Congrats",
        "Your booking is Cancelled Successfully",
        "succes"
      ).then((result) => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Oops", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-left">
      <div className="row-fluid">
        {loading && <Loader />}
        {bookings.map((booking) => (
          <div key={booking._id} className="col-md-6">
            <div className="bs">
              <h1>{booking.room}</h1>
              <p>
                <b>BookingId:</b> {booking._id}
              </p>
              <p>
                <b>Check-In:</b> {booking.fromdate}
              </p>
              <p>
                <b>Check-Out:</b> {booking.todate}
              </p>
              <p>
                <b>Amount:</b> {booking.totalamount}
              </p>
              <p>
                <b>Status:</b>{" "}
            {booking.status ==="cancelled" ? (<Tag color="red">Cancelled</Tag>) : <Tag color="green">Confirmed</Tag>}
                
              </p>
              {booking.status === "booked" && (
                <div className="text-right">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      cancelBooking(booking._id, booking.roomid);
                    }}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}
