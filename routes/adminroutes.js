import express from 'express'
import adminController from '../controllers/adminController.js';
import authController from '../controllers/authController.js';
import authAdmin from '../middleware/authadmin.js';


const adminRouter = express.Router();

adminRouter.post("/login/admin", authController.adminLogin);
adminRouter.post("/admin/addDoctor", authAdmin, adminController.addDoctor);
adminRouter.post("/admin/addPatient", authAdmin, adminController.addPatient);

export default adminRouter;