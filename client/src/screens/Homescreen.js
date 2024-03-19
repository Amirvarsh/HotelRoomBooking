// Homescreen.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);

  const [searchkey, setsearchkey] = useState("");
  const [type, settype] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setRooms(response.data);
        setduplicaterooms(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates) {
    try {
      setfromdate(dates[0].format("DD-MM-YYYY"));
      settodate(dates[1].format("DD-MM-YYYY"));

      var temprooms = [];

      for (const room of duplicaterooms) {
        var availability = false;
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            if (
              !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
                booking.fromdate,
                booking.todate
              ) &&
              !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
                booking.fromdate,
                booking.todate
              )
            ) {
              if (
                dates[0].format("DD-MM-YYYY") !== booking.fromdate &&
                dates[0].format("DD-MM-YYYY") !== booking.todate &&
                dates[1].format("DD-MM-YYYY") !== booking.fromdate &&
                dates[1].format("DD-MM-YYYY") !== booking.todate
              ) {
                availability = true;
              }
            }
          }
        } else {
          availability = true;
        }

        if (availability === true || room.currentbookings.length === 0) {
          temprooms.push(room);
        }
      }

      setRooms(temprooms);
    } catch (error) {}
  }

  function filterBySearch() {
    const temprooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );

    setRooms(temprooms);
  }

  function filterByType(e) {
    settype(e);
    if (e !== "all") {
      const temprooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() == e.toLowerCase()
      );
      setRooms(temprooms);
    } else {
      setRooms(duplicaterooms);
    }
  }

  return (
    <div className="container" style={{ padding: "60px" }}>
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker
            format="DD-MMM-YYYY"
            onChange={filterByDate}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>

        <div
          className="col-md-3"
          value={type}
          onChange={(e) => {
            filterByType(e.target.value);
          }}
        >
          <select className="form-control">
            <option value="all">All</option>
            <option value="Delux">Delux</option>
            <option value="Non-Delux">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-3">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="col-md-9 mt-2">
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;
