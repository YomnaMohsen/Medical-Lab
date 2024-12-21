import jwt from 'jsonwebtoken'
import passwordUtils from '../utils/passwordUtils.js';
import doctorModel from '../models/Doctor.js';
import formatValidationErrors from '../utils/Customerror.js';
// requires login
// admin login API

class adminController {
    static adminLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ meassage: "You can't leave email or password empty" });
            }
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const token = jwt.sign({ userId: process.env.ADMIN_ID + email }, process.env.JWT_SECRET,/* { expiresIn: '60s', }*/);
                res.status(200).json({ message: "User login successfully", token });
            }
            else {
                res.status(401).json({ success: false, message: "Invalid Credentials" });
            }

        }
        catch (error) {
            console.log(error);
            res.status(500).json({ meassage: error.meassage });
        }
    }
    // addDoctror api
    // need authorization
    static async addDoctor(req, res) {
        try {
            const { name, username, password, mobileNumber, email } = req.body;
            // check email validation
            // check password length
            // }
            const hashed_password = await passwordUtils.gen_password(password);
            const newDoctor = new doctorModel({
                name,
                username,
                password: hashed_password,
                mobileNumber,
                email
            });
            await newDoctor.save();
            res.status(201).json({ message: "Doctor added successfully" });
        }
        catch (err) {
            if (err.name === "ValidationError") {
                const errors = formatValidationErrors(err);
                res.status(400).json({
                    messages: errors,
                });

            }
            else {
                res.status(500).json({
                    message: "Internal Server Error",
                });
            }
        }
    }
}
export default adminController;