const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const billRoutes = require("./routes/billRoutes");

const app = express();
app.use(bodyParser.json());

// DB Connection
mongoose
  .connect("mongodb://localhost:27017/billService", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/bills", billRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Bill Service running on port ${PORT}`));
