const express = require("express");

const router = express.Router();

 

const {createOrder, getAllOrder, getOrder, deleteOrder} = require("../controllers/order")

router.post("/createOrder", createOrder);

router.get("/getAllOrder", getAllOrder);

router.post("/user", getOrder);

router.delete("/:id", deleteOrder);
 

 

module.exports = router