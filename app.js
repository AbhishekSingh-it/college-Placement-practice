const express = require('express')
const app =express()
const web =require('./routes/web')
const connectDb = require('./database/dbcon')
const flash = require('connect-flash');
const session = require('express-session')
var cookieParser = require('cookie-parser')
const setUserInfo = require('./middleware/setUserInfo');
// const fileUpload =require('express-fileupload')
require("dotenv").config();

//token get cookie
app.use(cookieParser())

app.use(setUserInfo)


// image upload form se controller ke pass jati hai
// app.use(fileUpload({
//     useTempFiles : true,
   
// }));

//message
app.use(session({
    secret:'secret',
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false
}))

//flash messages
app.use(flash());

//connect mongo
connectDb()

//view ejs
app.set('view engine', 'ejs')
//css image js link
app.use(express.static('public'))

//data get parse application
app.use(express.urlencoded())
//route load
app.use('/',web)

//server start
app.listen(process.env.PORT,()=>{
    console.log(`server start localhost:${process.env.PORT}`)
})




