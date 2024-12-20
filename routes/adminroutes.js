import express from 'express'
import adminLogin from '../controllers/adminController.js';
import authAdmin from '../middleware/authadmin.js';



const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/addDoctor", authAdmin, adminLogin);

export default adminRouter;