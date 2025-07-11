const jobModel = require('../models/job')
const bcrypt = require('bcrypt');
const StudentModel = require("../models/student")
const ApplicationModel = require('../models/Applicationmodel')
const sendEmail = require('../utils/sendmail')
const nodemailer = require('nodemailer')

class JobController {

  static display = async (req, res) => {
    const jobs = await jobModel.find({ companyId: req.user.id })
      .populate("companyId", "name") // 👈 ये जरूरी है
      .sort({ createdAt: -1 });
    try {
      res.render('job/display', {
        jobs: jobs,
        name: req.user.name,
        error: req.flash("error"),
        success: req.flash("success"),
      })  //folder (student) [insie] display.js
    } catch (error) {
      console.log(error)
    }
  }

  static insertJob = async (req, res) => {
    try {
      console.log(req.body)
      const {
        title,
        description,
        location,
        salary,
        department,
        jobType,
        applicationDeadline,
        min10Percent,
        min12Percent,
        minCGPA,
        maxBacklogs,
        allowedBranches,
        skillsRequired
      } = req.body;

      const newJob = new jobModel({
        title,
        description,
        location,
        salary,
        department,
        jobType,
        applicationDeadline,
        companyId: req.user.id,
        // company user id
        requirements: {
          min10Percent,
          min12Percent,
          minCGPA,
          maxBacklogs,
          allowedBranches: allowedBranches?.split(',').map(b => b.trim()),
          skillsRequired: skillsRequired?.split(',').map(s => s.trim())
        }
      });

      await newJob.save();
      res.redirect('/job/display');  // redirect to posted jobs page


    } catch (error) {
      console.log(error)

    }
  }

  static jobDelete = async (req, res) => {
    try {
      const id = req.params.id;
      await jobModel.findByIdAndDelete(id)
      req.flash("success", 'Hod delete successfully')
      res.redirect('/job/display')
    } catch (erorr) {
      console.log(error)
    }
  }
  static jobEdit = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const edit = await jobModel.findById(id);
      // console.log(view)
      res.render("job/edit", { edit });
    } catch (error) {
      console.log(error);
    }
  };
  static updateJob = async (req, res) => {
    console.log(req.body)
    try {
      const {
        title,
        description,
        salary,
        location,
        department,
        min12Percent,
        minCGPA,
        maxBacklogs,
        skillsRequired,
        allowedBranches,
      } = req.body;

      const updateData = {
        title,
        description,
        salary,
        location,
        department,
        requirements: {
          min12Percent: Number(min12Percent),
          minCGPA: Number(minCGPA),
          maxBacklogs: Number(maxBacklogs),
          skillsRequired: skillsRequired
            ? skillsRequired.split(",").map((skill) => skill.trim())
            : [],
          allowedBranches: allowedBranches
            ? allowedBranches.split(",").map((branch) => branch.trim())
            : [],
        },
      };

      await jobModel.findByIdAndUpdate(req.params.id, updateData);
      req.flash("success", "Job Update successfully");
      res.redirect("/job/display"); // Redirect to jobs list page
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  };

  static deleteJob = async (req, res) => {
    try {
      const jobId = req.params.id;
      await jobModel.findByIdAndDelete(jobId);
      // Redirect back to jobs listing page after delete
      req.flash("success", "Job delete successfully");

      res.redirect("/job/display");
    } catch (error) {
      console.log(error);
    }
  };


   static openingdisplay = async (req, res) => {
      try {
        const jobs = await jobModel.find({ status: 'open' })
          .populate('companyId', 'name')
          .sort({ createdAt: -1 });
    
        const student = await StudentModel.findById(req.user.id);
        if(req.user.role !== 'admin')
        {
          if (
            !student.Xyear ||
            !student.Xmarks ||
            !student.XIIyear ||
            !student.XIImarks ||
            !student.GraYear ||
            !student.GraCGPA ||
            !student.resume
          ) {
            req.flash('error', 'Please complete your profile and upload resume before applying.');
            return res.redirect('/uddateinfoStudent');
          }
        }
    
        res.render('students/openingDisplay', {
          jobs,
          studentId: req.user.id,
          student,
          success: req.flash('success'),
          error: req.flash('error')
        });
      } catch (error) {
        console.log(error);
      }
    };

// Student job apply karega
  static applyJob = async (req, res) => {
    try {
      const studentId = req.user.id;
      const student = await StudentModel.findById(studentId);
      // console.log(student)
  
      // 1. Check if profile is complete
      if (
        !student.Xyear ||
        !student.Xmarks ||
        !student.XIIyear ||
        !student.XIImarks ||
        !student.GraYear ||
        !student.GraCGPA ||
        !student.resume
      ) {
        req.flash('error', 'Please complete your profile and upload resume before applying.');
        return res.redirect('/uddateinfoStudent');
      }
  
      // 2. Check if already applied
      const alreadyApplied = await ApplicationModel.findOne({
        jobId: req.params.jobId,
        studentId: studentId,
      });
  
      if (alreadyApplied) {
        req.flash('error', 'You have already applied to this job.');
        return res.redirect('/student/jobs');
      }
  
      // 3. Save application
      const application = new ApplicationModel({
        jobId: req.params.jobId,
        studentId: studentId,
        status: 'Applied',
      });
      await application.save();
  
      // 4. Fetch job and company details
      const job = await jobModel.findById(req.params.jobId).populate('companyId');
      const company = job.companyId;
  
      // 5. Setup email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASS,
        },
      });
  
      // 6. Send email to company
      await transporter.sendMail({
        from: `"Jiwaji University" <${process.env.MAIL_ID}>`,
        to: company.email,
        subject: `New Application for ${job.title}`,
        html: `
          <h3>New Student Application</h3>
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Phone:</strong> ${student.phone}</p>
          <p><strong>Job:</strong> ${job.title}</p>
          <p><strong>Department:</strong> ${job.department}</p>
          <p><strong>Resume:</strong> <a href="${student.resume.url}" target="_blank">View Resume</a></p>
          <p><strong>Applied On:</strong> ${new Date().toLocaleString()}</p>
          <p>Login to your dashboard to view more details.</p>
        `,
      });
  
      // 7. Send confirmation email to student
      await transporter.sendMail({
        from: `"Jiwaji University" <${process.env.MAIL_ID}>`,
        to: student.email,
        subject: `You applied for ${job.title} at ${company.name}`,
        html: `
          <h3>Application Successful!</h3>
          <p>Dear ${student.name},</p>
          <p>You have successfully applied for:</p>
          <ul>
            <li><strong>Job:</strong> ${job.title}</li>
            <li><strong>Company:</strong> ${company.name}</li>
            <li><strong>Location:</strong> ${job.location}</li>
            <li><strong>Applied On:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>We wish you the best!</p>
        `,
      });
  
      // 8. Redirect
      req.flash('success', 'Applied successfully! Confirmation emails sent.');
      res.redirect('/student/my-applications');
  
    } catch (error) {
      console.log(error);
      req.flash('error', 'Something went wrong');
      res.redirect('/student/jobs');
    }
  };

}
module.exports = JobController