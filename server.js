const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://mugeskumar03:ogxlaUwqA2drNxNz@mugeskumar.y3gt6.mongodb.net//realestate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  sellerId: String,

});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;

  if (!user.sellerId) {
    user.sellerId = generateSellerId();
  }

  next();
});

const User = mongoose.model('User', UserSchema);

const PropertySchema = new mongoose.Schema({
  sellerId: String,
  name: String,
  place: String,
  area: String,
  bedrooms: String,
  bathrooms: String,
  nearby: String,
  likes: [],
});

const Property = mongoose.model('Property', PropertySchema);

app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user, sellerId: user.sellerId });
  } catch (error) {
    console.error('Error registering user', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email);
    const user = await User.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.send({ success: true, userType: user.userType, sellerId: user._id }); // Return the sellerId upon successful login
      } else {
        res.status(401).send({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.status(401).send({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/seller/property', async (req, res) => {
  try {
    const { sellerId, name, place, area, bedrooms, bathrooms, nearby } = req.body;
    const property = new Property({ sellerId, name, place, area, bedrooms, bathrooms, nearby });
    await property.save();
    res.send({ property, sellerId });
  } catch (error) {
    console.error('Error posting property', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/api/seller/properties', async (req, res) => {
  try {
    const { sellerId } = req.query;
    const properties = await Property.find({ sellerId });
    res.send(properties);
  } catch (error) {
    console.error('Error fetching properties', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.delete('/api/seller/property/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.send({ message: 'Property deleted' });
  } catch (error) {
    console.error('Error deleting property', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/seller/property/like', async (req, res) => {
  try {

    const { propertyId, userId } = req.body;
    const property = await Property.findById(propertyId);
    console.log(property, propertyId)
    if ((property?.likes || [])?.includes(userId)) {
      const likes = property?.likes?.filter(id => id !== userId)
      await Property.findByIdAndUpdate(propertyId, {
        likes: likes
      });
    } else {
      const likes = [...(property?.likes || []), userId]
      await Property.findByIdAndUpdate(propertyId, {
        likes: likes
      });
    }
    res.status(200).send({ data: "liked" });
  } catch (error) {
    console.error('Error posting property', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/seller/send-mail', async (req, res) => {
  try {

    const { sellerId, userId } = req.body;
    const seller = await User.findById(sellerId);
    const user = await User.findById(userId);


    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "mugeskumar",
          email: "mugeskumar3@gmail.com",
        },
        messageVersions: [
          {
            to: [
              {
                email: seller?.email,
                name: seller?.firstName,
              }],
          },
        ],
        subject: "Interested Clicked by user",
        htmlContent: `Interested by user
          Name : ${user?.firstName}
          Email : ${user?.email}
          phone : ${user?.phone}
        `,
      },
      {
        headers: {
          'content-type': 'application/json',
          'api-key': "",
          accept: 'application/json',
        },
      }
    );

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "mugeskumar",
          email: "mugeskumar3@gmail.com",
        },
        messageVersions: [
          {
            to: [
              {
                email: user?.email,
                name: user?.firstName,
              }],
          },
        ],
        subject: "Interested",
        htmlContent: `Interested Seller Detail
          Name : ${seller?.firstName}
          Email : ${seller?.email}
          phone : ${seller?.phone}
        `,
      },
      {
        headers: {
          'content-type': 'application/json',
          'api-key': "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",
          accept: 'application/json',
        },
      }
    );
    res.status(200).send({ data: "mail send successfully" });
  } catch (error) {
    console.error('Error posting property', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.send(properties);
  } catch (error) {
    console.error('Error fetching properties', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function generateSellerId() {
  const prefix = 'seller_';
  const randomNumber = Math.floor(Math.random() * 10000);
  return prefix + randomNumber;
}