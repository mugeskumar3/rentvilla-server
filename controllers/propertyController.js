const Property = require("../models/property");

exports.createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.send({ property });
  } catch (error) {
    console.error("Error posting property", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getPropertiesBySeller = async (req, res) => {
  try {
    const { sellerId } = req.query;
    const properties = await Property.find({ sellerId });
    res.send(properties);
  } catch (error) {
    console.error("Error fetching seller properties", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.send(properties);
  } catch (error) {
    console.error("Error fetching all properties", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.send({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.likeProperty = async (req, res) => {
  try {
    const { propertyId, userId } = req.body;
    const property = await Property.findById(propertyId);

    if (property.likes.includes(userId)) {
      property.likes = property.likes.filter(id => id !== userId);
    } else {
      property.likes.push(userId);
    }

    await property.save();
    res.status(200).send({ data: "like status updated" });
  } catch (error) {
    console.error("Error liking property", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
