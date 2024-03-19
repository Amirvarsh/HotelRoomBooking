import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs } from "antd";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";

const { TabPane } = Tabs;
function AdminScreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);
  return (
    <div style={{ padding: "70px" }}>
      <div className="ml-3 mt-3 mr-3 bs" style={{ padding: "70px" }}>
        <h2 className="text-center" style={{ fontSize: "30px" }}>
          <b>Admin Panel</b>
        </h2>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <h1
                style={{
                  fontFamily: "unset",
                  fontStyle: "italic",
                  fontWeight: "bolder",
                  fontSize: "15px",
                }}
              >
                Bookings
              </h1>
            }
            key="1"
          >
            <Bookings />
          </TabPane>
          <TabPane
            tab={
              <h1
                style={{
                  fontFamily: "unset",
                  fontStyle: "italic",
                  fontWeight: "bolder",
                  fontSize: "15px",
                }}
              >
                Rooms
              </h1>
            }
            key="2"
          >
            <Rooms />
          </TabPane>
          <TabPane
            tab={
              <h1
                style={{
                  fontFamily: "unset",
                  fontStyle: "italic",
                  fontWeight: "bolder",
                  fontSize: "15px",
                }}
              >
                AddRooms
              </h1>
            }
            key="3"
          >
            <AddRoom />
          </TabPane>
          <TabPane
            tab={
              <h1
                style={{
                  fontFamily: "unset",
                  fontStyle: "italic",
                  fontWeight: "bolder",
                  fontSize: "15px",
                }}
              >
                Users
              </h1>
            }
            key="4"
          >
            <Users />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminScreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await axios.get("/api/bookings/getallbookings")).data;
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-left row">
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <div className="table-responsive">
          <table className="table table-bordered table-dark mt-4">
            <thead className="bs thead-dark">
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Room</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No bookings available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-left row">
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}

        <div className="table-responsive">
          <table className="table table-bordered table-dark mt-4">
            <thead className="bs thead-dark">
              <tr>
                <th>Room ID</th>
                <th>Name ID</th>
                <th>Type</th>
                <th>Rent Per Day</th>
                <th>Max Count</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>{room.rentperday}</td>
                    <td>{room.maxcount}</td>
                    <td>{room.phonenumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Rooms available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await axios.get("/api/users/getallusers")).data;
        setusers(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-dark mt-4">
        <thead className="bs thead-dark">
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>User PhoneNumber</th>
            <th>Is Admin</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phonenumber}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No users available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

//Add Room Component

export function AddRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [name, setname] = useState("");
  const [rentperday, setrentperday] = useState();
  const [maxcount, setmaxcount] = useState();
  const [description, setdescription] = useState();
  const [phonenumber, setphonenumber] = useState();
  const [type, settype] = useState();
  const [ratings, setratings] = useState();
  const [imageurl1, setimageurl1] = useState();
  const [imageurl2, setimageurl2] = useState();
  const [imageurl3, setimageurl3] = useState();
  async function addRoom() {
    const newroom = {
      name,
      rentperday,
      maxcount,
      description,
      phonenumber,
      type,
      ratings,
      imageurls: [imageurl1, imageurl2, imageurl3],
    };
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/rooms/addroom", newroom)
      ).data;
      console.log(result);
      setLoading(false);
      Swal.fire("Congrats", "Your New Room Added Successfully", "sucess").then(
        (result) => {
          window.location.href = "/home";
        }
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }

  return (
    <div className="row">
      <div className="col-md-5">
        {loading && <Loader />}
        <input
          type="text"
          className="form-control"
          placeholder="room name"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="rent per day"
          value={rentperday}
          onChange={(e) => {
            setrentperday(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="max count"
          value={maxcount}
          onChange={(e) => {
            setmaxcount(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="description"
          value={description}
          onChange={(e) => {
            setdescription(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="phonenumber"
          value={phonenumber}
          onChange={(e) => {
            setphonenumber(e.target.value);
          }}
        />
      </div>
      <div className="col-md-5">
        {loading && <Loader />}
        <input
          type="text"
          className="form-control"
          placeholder="type"
          value={type}
          onChange={(e) => {
            settype(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="ratings"
          value={type}
          onChange={(e) => {
            setratings(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url 1"
          value={imageurl1}
          onChange={(e) => {
            setimageurl1(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url 2"
          value={imageurl2}
          onChange={(e) => {
            setimageurl2(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url 3"
          value={imageurl3}
          onChange={(e) => {
            setimageurl3(e.target.value);
          }}
        />
        <div className="text-right">
          <button className="btn btn-primary mt-2" onClick={addRoom}>
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}
