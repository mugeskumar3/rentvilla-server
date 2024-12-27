const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  sellerId: String,
  name: String,
  place: String,
  area: String,
  bedrooms: String,
  bathrooms: String,
  nearby: String,
  likes: [String],
});

module.exports = mongoose.model("Property", PropertySchema);
