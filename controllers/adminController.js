import mongoose from "mongoose";
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

            }
            const newDoctor = new doctorModel({
                name,
                username,
                password: hashed_password,
                mobileNumber,
                email
            });

            const savedDoctor = await newDoctor.save();
            const user = await doctorModel.findById(savedDoctor.id).select('-password');
            return res.status(201).json({ message: "Doctor added successfully", newDoctor: user });
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
                {
                    name: req.body.name,
                    username: req.body.username,
                    mobileNumber: req.body.mobileNumber,
                    email: req.body.email
                },
                { runValidators: true },
                { new: true }
            );
            if (!updateddoctor) {
                return res.status(404).json({ error: "Doctor not found" });
            }
            return res.status(200).json({ message: "Doctor data updated successfully", updateddoctor });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // delete doctor 
    static async deleteDoctor(req, res) {
        try {
            const deletedDoctor = await doctorModel.findByIdAndDelete(req.params.id);
            if (!deletedDoctor) {
                return res.status(404).json({ error: "Doctor not found" });
            }
            return res.status(200).json({ message: "Doctor deleted successfully", deletedDoctor });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // get all doctors 
    static async getAllDoctors(req, res) {
        const { limit, page } = req.query;
        const skip = (parseInt(page) - 1) * limit;
        try {
            const all_doctors = await doctorModel.find()
                .skip(parseInt(skip))// skip certain results based on skip value
                .limit(parseInt(limit))// limit no of results returned
            if (all_doctors.length === 0) {
                return res.status(404).json({ message: "No doctors can be reterived" });
            }
            const total_doctors = await doctorModel.countDocuments();
            const totalPages = Math.ceil(total_doctors / limit);
            return res.status(200).json({ message: `Reteriving ${all_doctors.length}`, total_pages: totalPages, current_page: page, doctors: all_doctors });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // patient operations
    ///////////////////////////////////////////////////
    // add patient 
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

    // get patient by id
    static async getPatient(req, res) {
        const { id } = req.params;
        try {
            const patient = await patientModel.findById(req.params.id);
            if (!patient) {
                return res.status(404).json({
                    error: `No patient with this id ${id}`
                });
            }
            return res.status(200).json({ patient });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // update patient
    static async updatePatient(req, res) {
        try {
            const updatedpatient = await patientModel.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    username: req.body.username,
                    gender: req.body.gender,
                    dateOfBirth: req.body.dateOfBirth,
                    insurance: req.body.insurance,
                    mobileNumber: req.body.mobileNumber,
                    email: req.body.email
                },
                { runValidators: true },
                { new: true }
            );
            if (!updatedpatient) {
                return res.status(404).json({ error: "Patient not found" });
            }
            return res.status(200).json({ message: "Patient data updated successfully", updatedpatient });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // delete patient 
    static async deletePatient(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        try {
            const deletedPatient = await patientModel.findByIdAndDelete(req.params.id);
            if (!deletedPatient) {
                return res.status(404).json({ error: "Patient not found" });
            }
            return res.status(200).json({ message: "Patient deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // get all doctors 
    static async getAllPatients(req, res) {
        const { limit, page } = req.query;
        const skip = (parseInt(page) - 1) * limit;
        try {
            const all_patients = await patientModel.find()
                .skip(parseInt(skip))// skip certain results based on page
                .limit(parseInt(limit))// limit no of results returned
            if (all_patients.length === 0) {
                return res.status(404).json({ message: "No patients can be reterived" });
            }
            const total_patients = await patientModel.countDocuments();
            const totalPages = Math.ceil(total_patients / limit);
            return res.status(200).json({ message: `Reteriving ${all_patients.length}`, total_pages: totalPages, current_page: page, patients: all_patients });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

}

export default adminController;