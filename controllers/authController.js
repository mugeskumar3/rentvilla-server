const User = require("../models/users");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user, sellerId: user.sellerId });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send({ success: true, userType: user.userType, sellerId: user._id });
    } else {
      res.status(401).send({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
