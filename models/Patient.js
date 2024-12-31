import mongoose from "mongoose";
import { type } from "os";

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    file: {
        name: { type: String },
        url: { type: String }
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
        unique: true,
        match: [/^0\+?[1-9]\d{1,14}$/, "Invalid mobile number format"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
});

// Add a virtual field for age
PatientSchema.virtual("age").get(function () {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday has not occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Ensure virtual fields are included when converting to JSON or Object
PatientSchema.set("toJSON", { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });
const patientModel = mongoose.model("Patient", PatientSchema);
export default patientModel; 
