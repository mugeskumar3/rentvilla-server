const User = require("../models/users");
const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
  try {
    const { sellerId, userId } = req.body;
    const [seller, user] = await Promise.all([User.findById(sellerId), User.findById(userId)]);

    if (!seller || !user) {
      return res.status(404).send({ error: "Seller or User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    const sellerMailOptions = {
      from: process.env.EMAIL,
      to: seller.email,
      subject: "Interest Shown by User",
      html: `<p>Interested user details:</p><p>Name: ${user.firstName}</p><p>Email: ${user.email}</p><p>Phone: ${user.phone}</p>`,
    };

    const userMailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Seller Details",
      html: `<p>Seller details:</p><p>Name: ${seller.firstName}</p><p>Email: ${seller.email}</p><p>Phone: ${seller.phone}</p>`,
    };

    await Promise.all([
      transporter.sendMail(sellerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
