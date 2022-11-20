const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
app.use(userRoutes);

const marvelRoutes = require("./routes/marvel");
app.use(marvelRoutes);

app.get("/", (req, res) => {
  res.send("Api Marvel started");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route not exist." });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started");
});
