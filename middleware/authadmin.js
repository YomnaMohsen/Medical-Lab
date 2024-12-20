import jwt from 'jsonwebtoken';

// admin auth middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers.Authorization;
        if (!atoken) {
            res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        else {
            const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);
            if (decoded_token.userId !== (process.env.ADMIN_ID + process.env.ADMIN_EMAIL)) {
                res.status(401).json({ success: false, message: "No premission to access this route" });
            }
            next();
        }
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }
}

export default authAdmin;