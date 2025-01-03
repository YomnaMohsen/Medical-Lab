import jwt from 'jsonwebtoken';

// admin auth middleware
const authAdmin = async (req, res, next) => {
    try {
        const atoken = req.headers.authorization;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        else {
            const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);
            if (decoded_token.userId !== (process.env.ADMIN_ID + process.env.ADMIN_EMAIL)) {
                return res.status(401).json({ success: false, message: "No premission to access this route" });
            }
        }
        next();
    }
    catch (error) {

        /* if (error.name === 'TokenExpiredError') {
             return { valid: false, expired: true, message:  };
         }*/
        return res.status(401).json({ success: false, message: "Token expired" });
    }
}

export default authAdmin;