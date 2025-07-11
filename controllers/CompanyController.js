const companyModel = require("../models/company")
const bcrypt = require('bcrypt');
const StudentModel = require("../models/student");
const cloudinary = require('cloudinary');
const jobModel = require('../models/job')
const ApplicationModel = require('../models/Applicationmodel')
const nodemailer = require('nodemailer')

cloudinary.config({
    cloud_name: "dpga2xk2l",
    api_key: "268848599614971",
    api_secret: "4Y7Rqn1oMqF_3XnhYTIyrdaqAFw"
});

class CompanyController {

    static display = async (req, res) => {
        const companies = await companyModel.find()

        try {
            res.render('company/display', {
                companies: companies,
                error: req.flash("error"),
                success: req.flash("success"),
            })  //folder (student) [insie] display.js
        } catch (error) {
            console.log(error)
        }
    }

    static insertCompany = async (req, res) => {
        try {
            console.log(req.body)
            const {
                name,
                email,
                password,
                phone,
                address,
                website,
                role
            } = req.body;
            const existingCompany = await companyModel.findOne({ email });
            if (existingCompany) {
                req.flash('error', "Email already registered")
                res.redirect('/company/display')

            }
            const hashPassword = await bcrypt.hash(password, 10);

            const result = await companyModel.create({
                name,
                email,
                password: hashPassword,
                phone,
                address,
                website,
                role
            })
            req.flash('success', "Student registered successfully!")
            res.redirect('/company/display')

        } catch (error) {
            console.log(error)

        }
    }

    static companyDelete = async (req, res) => {
        try {
            const id = req.params.id;
            await companyModel.findByIdAndDelete(id)
            req.flash("success", 'company delete succesfully')
            res.redirect('/company/display')
        } catch (error) {
            console.log(error)
        }
    }
    static companyView = async (req, res) => {

        try {
            const id = req.params.id
            // console.log(id)
            const view = await companyModel.findById(id)
            // console.log(view)
            res.render("company/view", { view })
        } catch (error) {

            console.log(error);
        }

    };

    static companyEdit = async (req, res) => {
        try {
            const id = req.params.id;
            // console.log(id)
            const edit = await companyModel.findById(id);
            // console.log(view)
            res.render("company/edit", { edit });
        } catch (error) {
            console.log(error);
        }
    };

    static companyUpdate = async (req, res) => {
        try {
            const id = req.params.id;
            const {
                name,
                email,
                password,
                phone,
                address,
                website,
            } = req.body;

            var data = {
                name,
                email,
                password,
                phone,
                address,
                website,
            };
            //   }
            await companyModel.findByIdAndUpdate(id, data);
            req.flash("success", "Update Profile successfully");
            res.redirect("/company/display");
        } catch (error) {
            console.log(error);
        }
    };
    static async companyViewApplications(req, res) {
    try {
      const companyId = req.user.id;
      const apps = await ApplicationModel.find().limit(5);
// apps.forEach(app => {
//   console.log("AppliedAt:", app.appliedAt);
// });
  
      const jobs = await jobModel.find({ companyId }, '_id');
      const jobIds = jobs.map(job => job._id);
  
      const applications = await ApplicationModel.find({
        jobId: { $in: jobIds }
      })
        .populate("studentId")
        .populate("jobId")
        .sort({ appliedAt: -1 }); // ✅ Latest first
  
      // Fallback fix: If appliedAt is missing or future-dated
      const now = new Date();
      for (let app of applications) {
        if (!app.appliedAt || app.appliedAt > now) {
          app.appliedAt = app._id.getTimestamp(); // Fix bad timestamps
          await app.save();
        }
      }
  
      res.render("company/applications", {
        applications,
        success: req.flash('success')
      });
  
    } catch (err) {
      console.error("Error fetching applications:", err);
     
    }
  }
  static async updateApplicationStatus(req, res) {
    try {
      const applicationId = req.params.id;
      const { status } = req.body;
  
      // Update application
      const updatedApplication = await ApplicationModel.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true }
      ).populate("studentId").populate({
        path: "jobId",
        model: "Job", // ✅ Matches your Job model
       
        })
  
      // Send email to student
      const studentEmail = updatedApplication.studentId.email;
      const studentName = updatedApplication.studentId.name;
      const jobTitle = updatedApplication.jobId.title;
  
      const mailOptions = {
        from: process.env.MAIL_ID,
        to: studentEmail,
        subject: `Application Status Update - ${jobTitle}`,
        html: `
          <p>Dear ${studentName},</p>
          <p>Your application status for the job <strong>${jobTitle}</strong> has been updated to: <strong>${status}</strong>.</p>
          <p>Best of luck!</p>
          <p><b>Jiwaji University Gwaliorl</b></p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      req.flash("success", "Application status updated & email sent");
      res.redirect("/applications");
    } catch (err) {
      console.error("Error updating status or sending email:", err);
      
    }
  }
  


}

module.exports = CompanyController