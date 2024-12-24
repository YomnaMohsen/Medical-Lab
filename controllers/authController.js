import jwt from 'jsonwebtoken'
import doctor from '../models/Doctor.js';
import patient from '../models/Patient.js';
import passwordUtils from '../utils/passwordUtils.js';

class authController {
    static async Doclogin(req, res) {
        try {
            const { username, password } = req.body;
            const user = await doctor.findOne({ username })
            if (!user) {
                return res.status(400).json({ success: false, message: "user deos not exist" });
            }
            const isMatch = await passwordUtils.compare_password(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
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


    static async Patlogin(req, res) {
        try {
            const { username, password } = req.body;
            const user = await patient.findOne({ username })
            if (!user) {
                return res.status(400).json({ success: false, message: "user deos not exist" });
            }
            const isMatch = await passwordUtils.compare_password(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                return res.status(200).json({ message: "User login successfully", token });
            }
            else {
                return res.status(401).json({ success: false, message: "Invalid Credentials" });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
}

export default authController;