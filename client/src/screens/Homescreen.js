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
                dates[1].format("DD-MM-YYYY")!== booking.todate
              ) {
                availability = true;
              }
            }
          }
        }else{
          availability=true;
        }
  
        if (availability === true || room.currentbookings.length === 0) {
          temprooms.push(room);
        }
      }
  
      setRooms(temprooms);
    } catch (error) {}
  }
  

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker
            format="DD-MM-YYYY"
            onChange={filterByDate}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="col-md-9 mt-2">
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
