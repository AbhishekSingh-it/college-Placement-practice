const StudentModel = require("../models/student")
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require("../config/cloudinary");
const sendMail = require("../utils/sendmail")
const ApplicationModel = require('../models/Applicationmodel')

const streamifier = require("streamifier");


cloudinary.config({
    cloud_name: "dpga2xk2l",
    api_key: "268848599614971",
    api_secret: "4Y7Rqn1oMqF_3XnhYTIyrdaqAFw"
});

class StudentController {

    static display = async (req, res) => {
        const students = await StudentModel.find()
        try {
            res.render('students/display', {
                students: students,
                role: req.user.role,
                name: req.user.name,
                error: req.flash("error"),
                success: req.flash("success"),
            })  //folder (student) [insie] display.js
        } catch (error) {
            console.log(error)
        }
    }
    // static insertStudent = async (req, res) => {
    //     try {

    //         // console.log(req.files)


    //         // console.log(req.body)
    //         const {
    //             rollNumber,
    //             name,
    //             address,
    //             gender,
    //             email,
    //             dob,
    //             phone,
    //             branch,
    //             semester,
    //             password,
    //         } = req.body;
    //         const existingStudent = await StudentModel.findOne({ email });
    //         const existingRoll = await StudentModel.findOne({ rollNumber });
    //         if (existingStudent) {
    //             req.flash('error', "Email already registered")
    //             res.redirect('/student/display')

    //         }
    //         if (existingRoll) {
    //             req.flash('error', "RollNumber already registered")
    //             res.redirect('/student/display')

    //         }
    //         const file =req.files.image
    //         const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
    //         folder: "student_images",
    //   });
    //         console.log(imageUpload)
            

    //         const hashPassword = await bcrypt.hash(password, 10);

    //         const result = await StudentModel.create({
    //             rollNumber,
    //             name,
    //             address,
    //             gender,
    //             email,
    //             dob,
    //             phone,
    //             branch,
    //             semester,
    //             password: hashPassword,
    //             image: {
    //              public_id: imageUpload.public_id,
    //              url: imageUpload.secure_url
    //     }
    //         })
    //         req.flash('success', "Student registered successfully!")
    //         res.redirect('/student/display')

    //     } catch (error) {
    //         console.log(error)

    //     }
    // }

    static insertStudent = async (req, res) => {
    try {
      const {
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
      } = req.body;

      const student = await StudentModel.findOne({ email });
      if (student) {
        req.flash("error", "Email already registered");
        return res.redirect("/student/display");
      }

      const password = "1234";
      const hashedPassword = await bcrypt.hash(password, 10);

      let imageData = {
        public_id: "",
        url: "",
      };

      if (req.file) {
        imageData.public_id = req.file.filename;
        imageData.url = req.file.path;
      }

      const newStudent = new StudentModel({
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
        password: hashedPassword,
        image: imageData,
        registeredBy: req.user.role,
      });

      await newStudent.save();
      const stringHash = hashedPassword.toString();

      await sendMail(
        email,
        "Welcome to Jiwaji University Gwalior",
        `Dear ${name},\n\nYour account has been created.\n\nLogin Email: ${email}\nPassword: 1234/nThank you!`
      );

      req.flash("success", "Student registered successfully and email sent.");
      res.redirect("/student/display");
    } catch (err) {
      console.log(err);
      req.flash("error", "Failed to register student.");
      res.redirect("/student/display");
    }
  };

  static studentDelete = async (req, res) => {
    try {
      const id =req.params.id
      // console.log(id)
      await StudentModel.findByIdAndDelete(id)
      req.flash("success","Student Delete successfully!")
      return res.redirect('/student/display')

    } catch (error) {
      console.log(error);
    }
  };

  static studentView = async (req,res) => {

    try {
        const id = req.params.id
    // console.log(id)
    const view = await StudentModel.findById(id)
    // console.log(view)
    res.render("students/view",{view}) 
    } catch (error) {

        console.log(error);
    }

  };

 static studentEdit = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const edit = await StudentModel.findById(id);
      // console.log(view)
      res.render("students/edit", { edit });
    } catch (error) {
      console.log(error);
    }
  };
  // static studentUpdate = async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const {
  //       rollNumber,
  //       name,
  //       address,
  //       gender,
  //       email,
  //       dob,
  //       phone,
  //       branch,
  //       semester,
  //       password,
  //     } = req.body;
  //     if (req.files) {
  //       const student = await StudentModel.findById(id);
  //       const imageID = student.image.public_id;
  //       // console.log(imageID);

  //       //deleting image from Cloudinary
  //       await cloudinary.uploader.destroy(imageID);
  //       //new image update
  //       const imagefile = req.files.image;
  //       const imageupload = await cloudinary.uploader.upload(
  //         imagefile.tempFilePath,
  //         {
  //           folder: "userprofile",
  //         }
  //       );
       
  //       var data = {
  //         rollNumber,
  //         name,
  //         address,
  //         gender,
  //         email,
  //         dob,
  //         phone,
  //         branch,
  //         semester,
  //         image: {
  //           public_id: imageupload.public_id,
  //           url: imageupload.secure_url,
  //         },
  //       };
  //     } else {
  //       var data = {
  //         rollNumber,
  //         name,
  //         address,
  //         gender,
  //         email,
  //         dob,
  //         phone,
  //         branch,
  //         semester,
  //       };
  //     }
  //     await StudentModel.findByIdAndUpdate(id, data);
  //     req.flash("success", "Update Profile successfully");
  //     res.redirect("/student/display");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
static studentUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const {
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
        password,
      } = req.body;

      const student = await StudentModel.findById(id);
      if (!student) {
        req.flash("error", "Student not found");
        return res.redirect("/student/display");
      }

      let updatedData = {
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
      };

      if (req.file) {
        // Delete old image from Cloudinary
        if (student.image && student.image.public_id) {
          await cloudinary.uploader.destroy(student.image.public_id);
        }

        // Upload new image to Cloudinary
        updatedData.image = {
          public_id: req.file.filename,
          url: req.file.path,
        };
      }

      await StudentModel.findByIdAndUpdate(id, updatedData);

      req.flash("success", "Profile updated successfully");
      res.redirect("/student/display");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong");
      res.redirect("/student/display");
    }
  };

  static uddateinfoStudent = async (req, res) => {
    const student = await StudentModel.findById(req.user.id);
    // console.log(student)

    try {
      res.render("students/updateinfo", {
        edit: student,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static studentUpdateInfo = async(req,res)=>{

   try {
      // console.log(req.body);

      const studentId = req.params.id;
      const { Xyear, Xmarks, XIIyear, XIImarks, GraYear, GraCGPA } = req.body;

      const student = await StudentModel.findById(studentId);
      if (!student) {
        req.flash("error", "Student not found");
        return res.redirect("back");
      }

      // === Handle Resume Upload to Cloudinary ===
      if (req.file) {
        // console.log(req.file)
        // Delete old resume from Cloudinary
        if (student.resume && student.resume.public_id) {
          await cloudinary.uploader.destroy(student.resume.public_id, {
            resource_type: "raw",
          });student
        }

        // Cloudinary upload stream (for PDFs/Word docs)
        const bufferStream = streamifier.createReadStream(req.file.buffer);
        // अब req.file.buffer में आपका resume file as a buffer (RAM में store) है।
        // फिर इस buffer को Cloudinary पर upload किया जाता है।
        //         जब आप कोई file memory में upload करते हो (जैसे multer.memoryStorage() के साथ), तो वो file RAM में Buffer के रूप में होती है।

        // अब Cloudinary जैसे कुछ services file को stream के रूप में लेती हैं — ना कि सीधे buffer.

        // तो streamifier.createReadStream(buffer) इस buffer को stream में convert करता है ताकि आप उसे .pipe() करके किसी destination (जैसे Cloudinary) तक भेज सको।
        console.log(bufferStream);

        const cloudinaryUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "student_resume",
                resource_type: "raw",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            bufferStream.pipe(stream);
          });

        const result = await cloudinaryUpload();

        // Update with new resume
        await StudentModel.findByIdAndUpdate(studentId, {
          Xyear,
          Xmarks,
          XIIyear,
          XIImarks,
          GraYear,
          GraCGPA,
          resume: {
            public_id: result.public_id,
            url: result.secure_url,
          },
        });

        req.flash("success", "Student info and resume updated successfully");
        return res.redirect("/uddateinfoStudent");
      } else {
        // No resume uploaded, only academic info updated
        await StudentModel.findByIdAndUpdate(studentId, {
          Xyear,
          Xmarks,
          XIIyear,
          XIImarks,
          GraYear,
          GraCGPA,
        });

        req.flash("success", "Student info updated successfully");
        return res.redirect("/uddateinfoStudent");
      }
    } catch (error) {
      console.error(error);
      req.flash("error", "Something went wrong");
      return res.redirect("back");
    }
  }

  static myApplications = async (req, res) => {
    try {
      const studentId = req.user.id;

      // Get all applications by student
      const applications = await ApplicationModel.find({ studentId })
        .populate({
          path: "jobId",
          model: "Job", // ✅ Matches your Job model
          populate: {
            path: "companyId",
            model: "company", // ✅ Must match your corrected model ref
          },
        })
        .sort({ appliedAt: -1 }); // Newest first
      // console.log(applications)

      res.render("students/myApplications", {
        title: "My Applications",
        applications,
      });
    } catch (error) {
      console.log(error);
     
    }
  };




}

module.exports = StudentController