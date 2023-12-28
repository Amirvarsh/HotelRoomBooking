const express = require("express");
const cors = require("cors");
const app = express();
const dbConfig = require("./db");

const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/usersRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use(express.json());

app.use(cors());

app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("This is the server");
});

app.listen(port, () => console.log(`Server is Running over the port ${port}`));
