const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");

router.post("/bookroom", async (req, res) => {
  try {
    const { token, room, userid, fromdate, todate, totalamount, totaldays } =
      req.body;

    // Create a new booking
    const newBooking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      fromdate,
      todate,
      totalamount: totalamount,
      totaldays,
      transactionId: uuidv4(),
    });

    // Save the booking to the database
    const booking = await newBooking.save();

    // Update room's current bookings
    const roomTmp = await Room.findOne({ _id: room._id });
    roomTmp.currentbookings.push({
      bookingid: booking._id,
      fromdate,
      todate,
      userid,
      status: "confirmed",
    });
    await roomTmp.save();

    res.status(200).json({ status: "success", bookingId: booking._id });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const booking = await Booking.findOne({ _id: bookingid });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    const room = await Room.findOne({ _id: roomid });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.currentbookings = room.currentbookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );

    await room.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
