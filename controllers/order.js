const Order = require('../models/order')

const asyncHandler = require("../middleware/async");
const order = require('../models/order');

 

exports.getAllOrder = async (req, res, next) => {

    try {

      const carts = await Order.find();

 

      res.status(200).json({

        success: true,

        count: carts.length,

        data: carts,

      });

    } catch (err) {

      res.status(400).json({ success: false });

    }

  };

 exports.createOrder = async (req, res, next) => {

    try {

      const cart = await Order.create(req.body);

 

      res.status(201).json({

        success: true,

        data: cart,

      });

    } catch (err) {

      next(err);

    }

  };

 

  exports.getOrder = async (req, res, next) => {

    try {

      const carts = await Order.find({user: req.body.user});

 

      res.status(200).json({

        success: true,

        count: carts.length,

        data: carts,

      });

    } catch (err) {

      res.status(400).json({ success: false });

    }

  };

 

  exports.deleteOrder = async (req, res, next) => {

    await Order.findByIdAndDelete(req.params.id).then((cart) => {

      if (!cart) {

        return res

          .status(404)

          .json({ message: "Cart not found with id of ${req.params.id}" });

      }

      res.status(200).json({ success: true, data: cart });

    });

  }