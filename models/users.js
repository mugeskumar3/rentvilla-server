const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generateSellerId = require("../utils/generateSellerId");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  sellerId: String,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  if (!this.sellerId) this.sellerId = generateSellerId();
  next();
});

module.exports = mongoose.model("User", UserSchema);