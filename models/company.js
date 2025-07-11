const mongoose = require('mongoose')

const CompanySchema = mongoose.Schema({
    name:{
        type :String,
        required: true,
    },
    email:{
        type :String,
        required: true,
    },
    password:{
        type :String,
        required: true,
    },
    phone:{
        type :String,
        required: true,
    },
    address:{
        type :String,
        required: true,
    },
    website:{
        type :String,
        required: true,
    },
    role:{
        type:String,
        default:"company"     
    },
    resetToken:{
      type:String
  },
  resetTokenExpiry:{
      type:String
  },
})

const CompanyModel = mongoose.model("company", CompanySchema)
module.exports = CompanyModel