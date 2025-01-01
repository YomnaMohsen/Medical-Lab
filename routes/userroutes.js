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
// doctor adds test
userRouter.post("/doctor/test", userController.addTest);
// doctor gets test by certain id
userRouter.get("/doctor/test/:id", userController.getTest);
// doctor updates test by certain id
userRouter.patch("/doctor/test/:id", userController.updateTest);
// doctor deletes test by certain id
userRouter.delete("/doctor/test/:id", userController.deleteTest);
// doctor gets all tests made by him 
userRouter.get("/doctor/tests/:id", userController.getTestsbyDoctor);
// doctor gets all tests for certain patient id
userRouter.get("/doctor/Alltests/:patientid/:id", userController.AllPatientTestsbyDoctor);





// patient protected routes
/////////////////////////////////
application.use(authUser, alloweduser(patientModel));
// patient gets certain test result
userRouter.patch("/patient/updatePassword", userController.updatePassword(patientModel));
userRouter.get("/patient/test/:id/:testid", userController.getPatientTest);
userRouter.get("/patient/Alltests/:id", userController.AllTestsbyPatient);
userRouter.post("/patient/appointment", userController.bookVisit);
//userRouter.get("/patient/Allappointments/:id", userController.getAllVisits);



export default userRouter;