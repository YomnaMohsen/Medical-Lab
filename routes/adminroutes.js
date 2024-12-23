import express from 'express'
import adminController from '../controllers/adminController.js';
import authAdmin from '../middleware/authadmin.js';


const adminRouter = express.Router();

adminRouter.post("/login", adminController.adminLogin);
adminRouter.post("/addDoctor", authAdmin, adminController.addDoctor);
adminRouter.post("/addPatient", authAdmin, adminController.addPatient);

export default adminRouter;