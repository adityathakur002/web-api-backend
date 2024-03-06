const asyncHandler = require("../middleware/async");
const Student = require("../models/student");
const Batch = require("../models/product");
const Course = require("../models/course");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Get all students
// @route   GET /api/v1/students
// @access  Private

exports.getStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find({});
  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// @desc    Get single student
// @route   GET /api/v1/students/:id
// @access  Private

exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res
      .status(404)
      .json({ message: "Student not found with id of ${req.params.id}" });
  } else {
    res.status(200).json({
      success: true,
      data: student,
    });
  }
});

// @desc    Create new student
// @route   POST /api/v1/students
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ username: req.body.username });
  if (student) {
    return res.status(400).send({ message: "Student already exists" });
  }

  
  await Student.create(req.body);

  res.status(200).json({
    success: true,
    message: "Student created successfully",
  });
});

// @desc   Login student
// @route  POST /api/v1/students/login
// @access Public

// exports.login = asyncHandler(async (req, res, next) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res
//       .status(400)
//       .send({ message: "Please provide an username and password" });
//   }

//   //Check for Student
//   const student = await Student.findOne({ username: username }).select(
//     "+password"
//   );

//   if (!Student) {
//     return res.status(400).send({ message: "Invalid Credentials" });
//     // return next(new ErrorResponse('Invalid credentials', 401));
//   }

//   //Check if password matches
//   const isMatch = await student.matchPassword(password);

//   if (!isMatch) {
//     return res.status(400).send({ message: "Invalid Credentials" });
//   }

//   sendTokenResponse(student, 200, res);
// });

exports.login = asyncHandler(async (req, res, next) => {

  const {username,password} = req.body

    Student.findOne({username})

    .then(user=>{

        if(!user) return res.status(401).json({error: 'User not registered'})

//user.password is hassed password

        bcrypt.compare(password, user.password, (err,success)=>{

            if(err) return res.status(500)

                .json({error: err.message})

 

            if(!success) return res.status(401)

                .json({error: 'Password does not match'})

            const payload={

                id: user._id,

                username: user.username,

            }

            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'}, (err, encoded)=>{

                if(err) res.status(500).json({error: err.message})

                res.json({

                    username: user.username,

                    token: encoded

                })

            })        

        })

    }).catch(next)

});
//=========================== Searching ===========================

// @desc    Search student by batch
// @route   GET /api/v1/students/search/:batchId
// @access  Private

exports.searchByBatch = asyncHandler(async (req, res, next) => {
  // const students = await Student.find({ batch: req.params.batchId });
  // if (!students) {
  //   return res.status(404).send({ message: "No students found" });
  // }
  // res.status(200).json({
  //   success: true,
  //   count: students.length,
  //   data: students,
  // });

  const batchId = req.params.batchId;
  Student.find({ batch: batchId })
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of students by batch",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

exports.getUser = asyncHandler(async (req,res,next)=> {

  Student.findOne({username: req.body.username})

  .then((user)=>{

    if(!user) return res.status(400).json({error: 'Student not found'})

    res.status(200).json({ success: true, data: user })

  }).catch(next)

})

// exports.getUserDetail= async(req,res,next) =>{

//   try {

//     const user = await Student.findById(req.params.username);
//     if (!product) {

//       return res.status(401).json({ message: "cannot find the Product " });

//     }
//     res.status(200).json({ success: true, data: product });

//   } catch (err) {

//     next(err);

//   }    
// }

// @desc    Search student by course
// @route   GET /api/v1/students/search/:courseId
// @access  Private

exports.searchByCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;

  Student.find({
    course: {
      $elemMatch: {
        $eq: { _id: courseId },
      },
    },
  })
    .select("-password -__v")
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of students by course",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

// @desc    Update student
// @route   PUT /api/v1/students/:id
// @access  Private

exports.updateStudent = asyncHandler(async (req, res, next) => {
  const user = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, user, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

// @desc    Delete student
// @route   DELETE /api/v1/students/:id
// @access  Private

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  Student.findByIdAndDelete(req.params.id)
    .then((student) => {
      if (student != null) {
        var imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          student.image
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "Student deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Student not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

// @desc Upload Single Image
// @route POST /api/v1/auth/upload
// @access Private

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

// Get token from model , create cookie and send response
const sendTokenResponse = (Student, statusCode, res) => {
  const token = Student.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
