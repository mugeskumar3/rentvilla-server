const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const emailRoutes = require("./routes/emailRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api", authRoutes);
app.use("/api", propertyRoutes);
app.use("/api", emailRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
