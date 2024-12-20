import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import passwordUtils from './utils/passwordUtils.js';
// admin login API
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ meassage: "You can't leave email or password empty" });
        }
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ userId: process.env.ADMIN_ID + email }, process.env.JWT_SECRET, { expiresIn: '60s', });
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

const addDoctor = async (req, res) => {
    try {
        const { name, username, password, contact } = req.body;
        if (!name || !username || !password || !contact) {
            res.status(400).json({ error: "Invalid or missing contact details." });
            // check email validation
            // check password length

            // save hashed password
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = bcrypt.hash(password, salt);

        }

    }
    catch (error) {

    }

}
export default adminLogin;