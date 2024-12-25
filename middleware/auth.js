import jwt from 'jsonwebtoken';

// user (patient or doctor) auth middleware
const authUser = async (req, res, next) => {
    try {
        const atoken = req.headers.authorization;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        else {
            const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);
            req.user = decoded_token;
            next();
        }
    }
    catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}

const alloweduser = (userModel) => {
    return async (req, res, next) => {
        const currentuser = await userModel.findById(req.user.id);
        if (!currentuser) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };

}

export default { authUser, alloweduser };