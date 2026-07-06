const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: String,
  phone: String,
  interest: String,
  message: String,
  type: String,
  submittedAt: Date,
});

const Contact = mongoose.model("Contact", contactSchema);

// API Route
app.post("/api/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();

    res.json({ success: true, message: "Response saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});

// =============================
// Configurator API
// =============================

const Configurator = require("./models/Configurator");

app.post("/api/configurator", async (req, res) => {
  try {
    const configurator = new Configurator(req.body);

    await configurator.save();

    res.status(200).json({
      success: true,
      message: "Response saved successfully."
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to save response."
    });
  }
});

// =============================
// Newsletter API
// =============================

const Newsletter = require("./models/Newsletter");
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.json({
        success: false,
        message: "This email is already subscribed.",
      });
    }

    // Save new subscriber
    const subscriber = new Newsletter({
      email,
      subscribedAt: new Date(),
    });

    await subscriber.save();

    res.json({
      success: true,
      message: "Subscribed successfully.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});