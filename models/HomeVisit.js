import mongoose from "mongoose";
const homeVisitSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },

    visitDate: {
        type: Date,
        required: true,
    }

    /*status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending',

    }*/

});
const homeVisitModel = mongoose.model("HomeVisit", homeVisitSchema);
export default homeVisitModel;