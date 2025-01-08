import express from 'express';
import doctorModel from '../models/Doctor.js';
import patientModel from '../models/Patient.js';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { authUser, alloweduser } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post("/patient/login", authController.Patlogin);
userRouter.post("/doctor/login", authController.Doclogin);


// doctor adds test
userRouter.post("/doctor/test", authUser, alloweduser(doctorModel), userController.addTest);
// doctor gets test by certain id
userRouter.get("/doctor/test/:id", authUser, alloweduser(doctorModel), userController.getTest);
// doctor updates test by certain id
userRouter.patch("/doctor/test/:id", authUser, alloweduser(doctorModel), userController.updateTest);
// doctor deletes test by certain id
userRouter.delete("/doctor/test/:id", authUser, alloweduser(doctorModel), userController.deleteTest);
// doctor gets all tests made by him 
userRouter.get("/doctor/tests", authUser, alloweduser(doctorModel), userController.getTestsbyDoctor);
// doctor gets all tests for certain patient id
userRouter.get("/doctor/Alltests/:patientid", authUser, alloweduser(doctorModel), userController.AllPatientTestsbyDoctor);
// doctor protected routes
userRouter.patch("/doctor/updatePassword", authUser, alloweduser(doctorModel), userController.updatePassword(doctorModel));



// patient protected routes
/////////////////////////////////

// patient gets certain test result
//userRouter.patch("/patient/updatePassword", userController.updatePassword(patientModel));
userRouter.get("/patient/:testid", authUser, alloweduser(patientModel), userController.getPatientTest);
userRouter.get("/patient/", authUser, alloweduser(patientModel), userController.AllTestsbyPatient);
userRouter.post("/patient/appointment", authUser, alloweduser(patientModel), userController.bookVisit);


export default userRouter;