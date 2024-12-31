import jwt from 'jsonwebtoken';

// user (patient or doctor) auth middleware
const authUser = async (req, res, next) => {
    try {
        const atoken = req.headers.authorization;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Please Login Again" });
        }
        const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);
        req.user = decoded_token;
        next();
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
        if (userModel.passwordChangedAt && req.user.iat * 1000 < userModel.passwordChangedAt.getTime()) {
            return res.status(401).json({ message: "user changed his password please log in again" });
        }

        next();
    };
}

export default { authUser, alloweduser };