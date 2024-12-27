const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

router.post("/seller/property", propertyController.createProperty);
router.get("/properties", propertyController.getAllProperties); 
router.get("/seller/properties", propertyController.getPropertiesBySeller);
router.delete("/seller/property/:id", propertyController.deleteProperty);
router.post("/seller/property/like", propertyController.likeProperty);

module.exports = router;
