import jwt from 'jsonwebtoken';

// admin auth middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            res.json({ success: false, message: "Not Authorized Login Again" });
        }
        else {
            const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);
            if (decoded_token !== (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)) {
                res.json({ success: false, message: "Not Authorized Login Again" });
            }
            next();
        }
    }
    catch (error) {
        res.json({ success: false, message: "Invalid credentials" });
    }
}

export default authAdmin;