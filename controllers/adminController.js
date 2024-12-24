import jwt from 'jsonwebtoken'
import passwordUtils from '../utils/passwordUtils.js';
import doctorModel from '../models/Doctor.js';
import patientModel from '../models/Patient.js';
import formatValidationErrors from '../utils/Customerror.js';
// requires login
// admin login API

class adminController {
    static adminLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ meassage: "You can't leave email or password empty" });
            }
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const token = jwt.sign({ userId: process.env.ADMIN_ID + email }, process.env.JWT_SECRET,/* { expiresIn: '60s', }*/);
                return res.status(200).json({ message: "User login successfully", token });
            }
            else {
                return res.status(401).json({ success: false, message: "Invalid Credentials" });
            }

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.meassage });
        }
    }
    // addDoctror api
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
            await newDoctor.save();
            return res.status(201).json({ message: "Doctor added successfully" });
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
            await newPatient.save();
            return res.status(201).json({ message: "Patient added successfully" });
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