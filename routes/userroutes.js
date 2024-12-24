import express from 'express'
import authController from '../controllers/authController.js';
//import authAdmin from '../middleware/authadmin.js';


const userRouter = express.Router();

userRouter.post("/login/patient", authController.Doclogin);
userRouter.post("/login/doctor", authController.Patlogin);
//adminRouter.post("/addPatient", authAdmin, adminController.addPatient);

export default userRouter;