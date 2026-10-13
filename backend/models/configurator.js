const mongoose = require("mongoose");

const configuratorSchema = new mongoose.Schema({
  occasion: String,
  product: String,
  budget: String,
  quantity: String,
  branding: String,

  name: String,
  company: String,
  email: String,
  phone: String,

  submissionId: String,
  submittedAt: Date,
});

module.exports = mongoose.model("Configurator", configuratorSchema);