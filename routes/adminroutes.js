import express from 'express'
import adminController from '../controllers/adminController.js';
import authController from '../controllers/authController.js';
import authAdmin from '../middleware/authadmin.js';


const adminRouter = express.Router();

adminRouter.post("/login", authController.adminLogin);
// doctor operations
// add doctor
adminRouter.post("/doctor", authAdmin, adminController.addDoctor);
// get doctor by id
adminRouter.get("/doctor/:id", authAdmin, adminController.getDoctor);
// update doctor
adminRouter.patch("/doctor/:id", authAdmin, adminController.updateDoctor);
// delete doctor  
adminRouter.delete("/doctor/:id", authAdmin, adminController.deleteDoctor);
// get all doctors data
adminRouter.get("/alldoctors", authAdmin, adminController.getAllDoctors);

///////////////////////////////////////////////////////////////////////
// patient operations
//add patient
adminRouter.post("/patient", authAdmin, adminController.addPatient);
//get patient by id
adminRouter.get("/patient/:id", authAdmin, adminController.getPatient);
//update patient
adminRouter.patch("/patient/:id", authAdmin, adminController.updatePatient);
//delete patient
adminRouter.get("/patient/:id", authAdmin, adminController.deletePatient);

export default adminRouter;