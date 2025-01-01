import express, { application } from 'express';
import doctorModel from '../models/Doctor.js';
import patientModel from '../models/Patient.js';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { authUser, alloweduser } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post("/patient/login", authController.Patlogin);
userRouter.post("/doctor/login", authController.Doclogin);


application.use(authUser, alloweduser(doctorModel));
// doctor protected routes
userRouter.patch("/doctor/updatePassword", userController.updatePassword(doctorModel));
userRouter.post("/doctor/test", userController.addTest);
userRouter.get("/doctor/test/:id", userController.getTest);
userRouter.patch("/doctor/test/:id", userController.updateTest);
userRouter.delete("/doctor/test/:id", userController.deleteTest);
userRouter.get("/doctor/tests/:doctorid", userController.getTestsbyDoctor);
userRouter.get("/doctor/Alltests/:patientid/:doctorid", userController.AllPatientTestsbyDoctor);





// patient protected routes
/////////////////////////////////
application.use(authUser, alloweduser(patientModel));
// patient gets certain test result
userRouter.patch("/patient/updatePassword", authUser, alloweduser(patientModel), userController.updatePassword(patientModel));
userRouter.get("/patient/test/:patientid/:testid", authUser, alloweduser(patientModel), userController.getPatientTest);
userRouter.get("/patient/Alltests/:patientid", authUser, alloweduser(patientModel), userController.AllTestsbyPatient);
userRouter.post("/patient/appointment", authUser, alloweduser(patientModel), userController.bookVisit);
userRouter.get("/patient/Allappointments/patientid", authUser, alloweduser(patientModel), userController.getAllVisits);



export default userRouter;