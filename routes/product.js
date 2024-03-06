const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const {
  getProduct,
  getProducts,
  createProduct,
  uploadImage,
  deleteProduct,
  editProduct,
} = require("../controllers/product");

router.get("/getAllProducts", getProducts);
router.post("/uploadImage", upload, uploadImage);
router.get("/:id", getProduct);

router.post("/createProduct", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", editProduct);

module.exports = router;
