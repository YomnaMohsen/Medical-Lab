import mongoose from "mongoose";
const homeVisitSchema = new mongoose.Schema({
    patient: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
        },

    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },

});