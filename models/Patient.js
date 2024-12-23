import mongoose from "mongoose";
import { type } from "os";

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
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
    insurance: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: [true, "Gender is required"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required"],
        validate: {
            validator: function (value) {
                return value <= new Date(); // Ensure the date is not in the future
            },
            message: 'Date of Birth cannot be in the future',
        }

    },

    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        match: [/^\+?[0-9]\d{1,14}$/, "Invalid mobile number format"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
});

const patientModel = mongoose.model("Patient", PatientSchema);
export default patientModel; 
