import express from 'express';
import doctorModel from '../models/Doctor.js';
import patientModel from '../models/Patient.js';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { authUser, alloweduser } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post("/login/patient", authController.Doclogin);
userRouter.post("/login/doctor", authController.Patlogin);

// doctor protected routes
userRouter.post("/doctor/addtest", authUser, alloweduser(doctorModel), userController.addTest);
userRouter.get("/doctor/gettest/:id", authUser, alloweduser(doctorModel), userController.getTest);
userRouter.patch("/doctor/updatetest/:id", authUser, alloweduser(doctorModel), userController.updateTest);
userRouter.delete("/doctor/deletetest/:id", authUser, alloweduser(doctorModel), userController.deleteTest);
userRouter.get("/doctor/gettests/:doctorid", authUser, alloweduser(doctorModel), userController.getTestsbyDoctor);
userRouter.get("/doctor/gettests/:patientid/:doctorid", authUser, alloweduser(doctorModel), userController.AllPatientTestsbyDoctor);




// patient protected routes
/////////////////////////////////
// patient gets certain test result
userRouter.get("/patient/gettest/:patientid/:testid", authUser, alloweduser(patientModel), userController.getPatientTest);
userRouter.get("/patient/getAlltests/:patientid", authUser, alloweduser(patientModel), userController.AllTestsbyPatient);
userRouter.post("/patient/bookHomeVisit", authUser, alloweduser(patientModel), userController.bookVisit);
//userRouter.post("/patient/viewtest".authUser, userController);// needs id



export default userRouter;