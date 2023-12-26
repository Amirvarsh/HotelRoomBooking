const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51OQZ27SDA4LzPuFd4W6wyZXRqqvj7PgKT2vGqKZYcxxpem5mJ84kXN7jYumA1bZiJdmyr1wsYkmwMaNVGQ5NOgg400QLYB6BIT"
);

router.post("/bookroom", async (req, res) => {
  try {
    const { room, userid, fromdate, todate, totalamount, totaldays, token } =
      req.body;

    // Create customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Charge payment
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "inr",
        // statement_description_suffix: "Payment using Stripe",
        payment_method: "pm_card_visa",
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    // Payment Success
    if (paymentIntent) {
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

      const booking = await newBooking.save();

      const roomTmp = await Room.findOne({ _id: room._id });
      roomTmp.currentbookings.push({
        bookingid: booking._id,
        fromdate,
        todate,
        userid,
        status: booking.status,
      });

      await roomTmp.save();

      return res.status(200).json({ status: "success" });
    }

    // Payment Failure
    return res.status(400).json({ message: "Payment Failed" });
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
module.exports = router;
