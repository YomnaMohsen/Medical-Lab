import mongoose from "mongoose";
import { type } from "os";

const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false, // Prevent the password from being returned in queries
    },

    contact: {
        mobileNumber: {
            type: String,
            required: [true, "Mobile number is required"],
            match: [/^\+?[1-9]\d{1,14}$/, "Invalid mobile number format"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/\S+@\S+\.\S+/, "Invalid email address"],
        }
    },
});
const doctormodel = mongoose.model("Doctor", DoctorSchema);
export default doctormodel;