const express = require("express");
const cors = require("cors");
const app = express();
const dbConfig = require("./db");

const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/usersRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use(
  cors({
    origin: ["https://deploy-mern-1whp.vercel.app"],
    method: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("It is working successfully");
});

app.listen(port, () => console.log(`Server is Running over the port ${port}`));
