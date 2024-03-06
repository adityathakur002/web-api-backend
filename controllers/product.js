const asyncHandler = require("../middleware/async");
const Product = require("../models/product");

// @desc    Get all batches
// @route   GET /api/v1/batches
// @access  Public

exports.getProducts = asyncHandler(async (req, res, next) => {
  try {
    const batch = await Product.find({});
    res.status(200).json({
      success: true,
      count: batch.length,
      data: batch,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

// @desc    Get single batch
// @route   GET /api/v1/batches/:id
// @access  Public

exports.getProduct= async(req,res,next) =>{

  try {

    const product = await Product.findById(req.params.id);
    if (!product) {

      return res.status(401).json({ message: "cannot find the Product " });

    }
    res.status(200).json({ success: true, data: product });

  } catch (err) {

    next(err);

  }    

}

// @desc    Create new batch
// @route   POST /api/v1/batches
// @access  Private

exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

exports.uploadImage = asyncHandler(async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// @desc    Update batch
// @route   PUT /api/v1/batches/:id
// @access  Private

// exports.updateBatch = asyncHandler(async (req, res, next) => {
//   let batch = await Batch.findById(req.params.id);

//   if (!batch) {
//     return res
//       .status(404)
//       .json({ message: "Batch not found with id of ${req.params.id}" });
//   }

//   batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: batch,
//   });
// });

// @desc    Delete batch
// @route   DELETE /api/v1/batches/:id
// @access  Private

// exports.deleteBatch = asyncHandler(async (req, res, next) => {
//   const batch = await Batch.findById(req.params.id);

//   if (!batch) {
//     return res
//       .status(404)
//       .json({ message: "Batch not found with id of ${req.params.id}" });
//   }

//   batch.remove();

//   res.status(200).json({
//     success: true,
//     data: {},


//   });
// });
exports.deleteProduct = async (req, res, next) => {

  await Product.findByIdAndDelete(req.params.id).then((cart) => {

    if (!cart) {

      return res

        .status(404)

        .json({ message: "Cart not found with id of ${req.params.id}" });

    }

    res.status(200).json({ success: true, data: cart });

  });

}


exports.editProduct = async (req, res, next) => {

  try {

    let product = await Product.findById(req.params.id);

    if (!product) {

      return res

        .status(404)

        .json({ message: "Product not found with id of ${req.params.id}" });

    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {

      new: true,

      runValidators: true,

    });



    res.status(200).json({ success: true, data: product });

  } catch (err) {

    next(err);

  }

};