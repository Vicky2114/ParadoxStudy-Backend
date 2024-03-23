const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authController = require("./src/controllers/auth_controller");
const path = require("path");
dotenv.config();
app.use(
  cors({
    origin: ["https://paradoxstudy.me/", "http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use("/public", express.static(__dirname + "/public"));

app.use(express.json());

app.get("/", authController.start);
app.use("/api", require("./src/routes"));

const dbURI = process.env.MONGO_URL;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successful connection
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
