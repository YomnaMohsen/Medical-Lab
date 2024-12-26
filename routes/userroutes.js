import express from 'express'
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';


const userRouter = express.Router();

userRouter.post("/login/patient", authController.Doclogin);
userRouter.post("/login/doctor", authController.Patlogin);

// doctor protected routes
userRouter.post("/doctor/addtest", authUser, userController.addTest);
userRouter.get("/doctor/gettest/:id", authUser, userController.getTest);
userRouter.patch("/doctor/updatetest/:id", authUser, userController.updateTest);
userRouter.delete("/doctor/deletetest/:id", authUser, userController.deleteTest);
userRouter.get("/doctor/gettests/:doctorid", authUser, userController.getTestsbyDoctor);
userRouter.get("/doctor/gettests/:patientid/:doctorid", authUser, userController.AllPatientTestsbyDoctor);




// patient protected routes
userRouter.get("/patient/gettest/:testid", authUser, userController.getPatientTest);
userRouter.get("/patient/getAlltests/:patientid", authUser, userController.AllTestsbyPatient);
userRouter.post("/patient/bookvisit", authUser, userController.bookVisit);
//userRouter.post("/patient/viewtest".authUser, userController);// needs id



export default userRouter;