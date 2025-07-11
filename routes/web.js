const express = require('express')
const FrontController = require('../controllers/FrontController')
const StudentController = require('../controllers/StudentController')
const HodController = require('../controllers/HodController')
const CompanyController = require('../controllers/CompanyController')
const JobController = require('../controllers/jobController')
const checkAuth = require('../middleware/auth')
const upload = require("../middleware/multer")

const uploadResume = require('../middleware/uploadResume');

// यहां uploadResume.single('resume') इस बात को देखता है कि form में "resume" नाम से जो file आई है, उसे process किया जाए।

// यह file को memory में store करता है और फिर req.file में डाल देता है।zz


const route = express.Router()

route.get('/', FrontController.home)
route.get('/contact', FrontController.contact)
route.get('/login', FrontController.login)
route.get('/register', FrontController.register)
route.get('/dashboard', checkAuth, FrontController.dashboard)
route.get('/logout', FrontController.logout)
route.post('/registerAdmin', FrontController.registerAdmin)
route.post('/verifyLogin', FrontController.verifyLogin)

route.get('/change-password', checkAuth, FrontController.changePasswordPage);
route.post('/change-password', checkAuth, FrontController.changePassword);

// student controller 
route.get('/student/display',checkAuth,StudentController.display)
route.post('/student/insert',upload.single('image'),checkAuth,StudentController.insertStudent)
route.get('/studentDelete/:id',checkAuth,StudentController.studentDelete)
route.get('/studentView/:id',checkAuth,StudentController.studentView)
route.get('/studentEdit/:id',checkAuth,StudentController.studentEdit)
route.post('/studentUpdate/:id',upload.single('image'),checkAuth,StudentController.studentUpdate)


// HOD controller 
route.get('/Hod/display', checkAuth, HodController.display)
route.post('/Hod/insert',upload.single('image'), checkAuth, HodController.insertHod)
route.get('/hodDelete/:id', HodController.hodDelete)
route.get('/hodview/:id', HodController.hodView)
route.get('/hodEdit/:id', HodController.hodEdit)
route.post('/hodUpdate/:id',upload.single('image'),checkAuth,HodController.hodUpdate)


//update info student 
route.get('/uddateinfostudent',checkAuth,StudentController.uddateinfoStudent)

route.post('/studentUpdateInfo/:id',uploadResume.single('resume'),StudentController.studentUpdateInfo)
route.get('/student/my-applications',checkAuth,StudentController.myApplications)



// company controller 
route.get('/company/display', checkAuth, CompanyController.display)
route.post('/company/insert',checkAuth, CompanyController.insertCompany);
route.get('/companyDelete/:id', CompanyController.companyDelete);
route.get('/companyView/:id', CompanyController.companyView)
route.get('/companyEdit/:id', CompanyController.companyEdit);
route.post('/companyUpdate/:id',checkAuth,CompanyController.companyUpdate)
route.get('/applications',checkAuth,CompanyController.companyViewApplications)
route.post('/company/update-status/:id', checkAuth, CompanyController.updateApplicationStatus);


// Job controller
route.get('/job/display',checkAuth,JobController.display)
route.post('/company/jobs/add',checkAuth, JobController.insertJob);
route.get('/job/delete/:id',checkAuth, JobController.jobDelete);
route.get('/job/edit/:id', JobController.jobEdit);
route.post('/company/jobs/Update/:id',checkAuth,JobController.updateJob)
route.get('/student/jobs',checkAuth,JobController.openingdisplay)

route.post("/student/apply/:jobId",JobController.applyJob)

//forget password
route.get('/forgot-password',FrontController.forgotPasswordForm)
route.post('/forgot-password1',FrontController.forgotPassword)
route.get("/reset-password/:role/:token", FrontController.getResetPassword);
route.post("/reset-password/:role/:token", FrontController.postResetPassword);




module.exports = route 