import jwt from 'jsonwebtoken'
import passwordUtils from '../utils/passwordUtils.js';
import doctorModel from '../models/Doctor.js';
import patientModel from '../models/Patient.js';
import formatValidationErrors from '../utils/Customerror.js';
// requires login
// admin login API

class adminController {

    // need auth, protected 
    static async addDoctor(req, res) {
        try {
            const { name, username, password, mobileNumber, email } = req.body;

            if (password) {
                if (password.length < 8) {
                    return res.status(400).json({
                        message: "Password must be greater than or equal 8 charcters"
                    });
                }
                var hashed_password = await passwordUtils.gen_password(password);
                console.log("before", hashed_password);
            }
            const newDoctor = new doctorModel({
                name,
                username,
                password: hashed_password,
                mobileNumber,
                email
            });
            console.log("after", hashed_password)
            const savedDoctor = await newDoctor.save();
            return res.status(201).json({ message: "Doctor added successfully", newDoctor: savedDoctor });
        }
        catch (err) {
            if (err.name === "ValidationError") {
                const errors = formatValidationErrors(err);
                return res.status(400).json({ message: errors });
            }
            else if (err.code === 11000) {

                return res.status(400).json({ message: "Value already exists", error: err.keyValue });
            }
            else {
                return res.status(400).json({ message: err.message });
            }
        }
    }
    // get doctor by id
    static async getDoctor(req, res) {
        const { id } = req.params;
        try {
            const doctor = await doctorModel.findById(req.params.id);
            if (!doctor) {
                return res.status(404).json({
                    error: `No doctor with this id ${id}`
                });
            }
            return res.status(200).json({ doctor });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // update doctor
    static async updateDoctor(req, res) {
        try {
            const updateddoctor = await doctorModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updateddoctor) {
                return res.status(404).json({ error: "Doctor not found" });
            }
            return res.status(200).json({ message: "Doctor data updated successfully", updatedResult });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // delete doctor 
    static async deleteDoctor(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        try {
            const deletedDoctor = await doctorModel.findByIdAndDelete(req.params.id);
            if (!deletedDoctor) {
                return res.status(404).json({ error: "Doctor not found" });
            }
            return res.status(200).json({ message: "Doctor deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async addPatient(req, res) {
        try {
            const { name, username, password, insurance, gender, dateOfBirth, mobileNumber, email } = req.body;
            /* if (!name || !username || !password || !mobileNumber || !email) {
                 res.status(400).json({ message: "One or more fields are missing" });
             }*/
            const parsedDate = new Date(dateOfBirth);
            if (password) {
                if (password.length < 8) {
                    return res.status(400).json({
                        message: "Password must be greater than or equal 8 charcters"
                    });
                }
                var hashed_password = await passwordUtils.gen_password(password);
            }

            const newPatient = new patientModel({
                name,
                username,
                password: hashed_password,
                insurance,
                gender,
                dateOfBirth: parsedDate,
                mobileNumber,
                email
            });
            const savedPatient = await newPatient.save();
            return res.status(201).json({ message: "Patient added successfully", newPatient: savedPatient });
        }
        catch (err) {
            if (err.name === "ValidationError") {
                const errors = formatValidationErrors(err);
                return res.status(400).json({ message: errors });
            }
            else if (err.code === 11000) {

                return res.status(400).json({ message: "Value already exists", error: err.keyValue });
            }
            else {
                return res.status(400).json({ message: err.message });
            }
        }
    }

}

export default adminController;