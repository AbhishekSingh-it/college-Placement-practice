const hodModels = require('../models/hod')
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: "dpga2xk2l",
  api_key: "268848599614971",
  api_secret: "4Y7Rqn1oMqF_3XnhYTIyrdaqAFw"
});

class HodController {

  static display = async (req, res) => {
    const hods = await hodModels.find()
    try {
      res.render('hod/display', {
        hods: hods,
        role: req.user.role,
        name: req.user.name,
        error: req.flash("error"),
        success: req.flash("success"),

      }) // folder (Hod) [inside] display
    } catch (error) {
      console.log(error)
    }
  }
  static insertHod = async (req, res) => {
    try {
      // console.log(req.body);
      // console.log(req.files.image)

      const { name, address, gender, department, dob, email, phone } = req.body;

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

      const result = await hodModels.create({
        name,
        address,
        gender,
        department,
        dob,
        email,
        phone,
        password: hashedPassword,
        image: imageData,
        registeredBy: req.user.role,
      });

      await result.save();

      req.flash("success", "Hod registered successfully!");
      res.redirect("/hod/display");
    } catch (error) {
      console.log(error);
      req.flash("error", "Failed to register Hod.");
      res.redirect("/hod/display");
    }
  };



  static hodDelete = async (req, res) => {
    try {
      const id = req.params.id;
      await hodModels.findByIdAndDelete(id)
      req.flash("success", 'Hod delete successfully')
      res.redirect('/Hod/display')
    } catch (erorr) {
      console.log(error)
    }
  }
  static hodView = async (req, res) => {

    try {
      const id = req.params.id
      // console.log(id)
      const view = await hodModels.findById(id)
      // console.log(view)
      res.render("hod/view", { view })
    } catch (error) {

      console.log(error);
    }

  };

  static hodEdit = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const edit = await hodModels.findById(id);
      // console.log(view)
      res.render("hod/edit", { edit });
    } catch (error) {
      console.log(error);
    }
  };
  static hodUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, address, gender, email, dob, phone, department } = req.body;

      const hod = await hodModels.findById(id);
      if (!hod) {
        req.flash("error", "Hod not found");
        return res.redirect("/hod/display");
      }

      let updatedData = {
        name,
        address,
        gender,
        email,
        dob,
        phone,
        department,
      };

      if (req.file) {
        // Delete old image from Cloudinary
        if (hod.image && hod.image.public_id) {
          await cloudinary.uploader.destroy(hod.image.public_id);
        }

        // Upload new image to Cloudinary
        updatedData.image = {
          public_id: req.file.filename,
          url: req.file.path,
        };
      }

      await hodModels.findByIdAndUpdate(id, updatedData);

      req.flash("success", "Profile updated successfully");
      res.redirect("/hod/display");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong");
      res.redirect("/hod/display");
    }
  };


}
module.exports = HodController