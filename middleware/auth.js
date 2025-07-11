// middleware/authmiddleware.js
const jwt = require('jsonwebtoken');

const checkAuth = (req,res,next) =>{
    const token = req.cookies.token;

    if(!token){
        req.flash("error", "unauthorised user please login")
        return res.redirect("/login")
    }
    try{
        const decoded = jwt.verify(token,process.env.jwt_secret_key);
        console.log(decoded)
        req.user = decoded;
        next();
    }catch(error){
        return res.redirect("/login")
    }
    
};

module.exports = checkAuth;