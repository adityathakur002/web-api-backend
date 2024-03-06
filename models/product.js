const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add employee name"],
  },
  price: {
    type:String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
  
  category: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Product", productSchema);
