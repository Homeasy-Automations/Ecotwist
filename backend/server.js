const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Newsletter = require("./models/Newsletter");
const Configurator = require("./models/configurator");

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

app.get("/", (req, res) => {
  res.send("EcoTwist Backend Running 🚀");
});

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

// =============================
// Configurator API
// =============================

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

app.post("/api/newsletter", async (req, res) => {

  console.log("========== NEWSLETTER API ==========");
  console.log("Request Body:", req.body);

  try {
    const { email } = req.body;

    console.log("Email:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const existing = await Newsletter.findOne({ email });

    console.log("Existing User:", existing);

    if (existing) {
      return res.json({
        success: false,
        message: "This email is already subscribed.",
      });
    }

    const subscriber = new Newsletter({
      email,
      subscribedAt: new Date(),
    });

    console.log("Saving to MongoDB...");

    await subscriber.save();

    console.log("Saved Successfully!");

    res.json({
      success: true,
      message: "Subscribed successfully.",
    });

  } catch (err) {
    console.error("Newsletter Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});