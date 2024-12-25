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



// patient protected routes
userRouter.post("/patient/addtest", authUser, userController);
userRouter.post("/patient/deletetest", authUser, userController);
userRouter.post("/patient/edittest", authUser, userController);
userRouter.post("/patient/viewtest".authUser, userController);// needs id



export default userRouter;