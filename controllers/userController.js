import passwordUtils from '../utils/passwordUtils.js';
import testResults from '../models/TestResults.js';
import homeVisitModel from '../models/HomeVisit.js';
import formatValidationErrors from '../utils/Customerror.js';
import mongoose from "mongoose";
import patientModel from '../models/Patient.js';
import sendEmail from '../config/sendEmail.js';
class userController {
    // user updates its password
    static updatePassword(Model) {
        return async (req, res) => {
            const userId = req.params.id;
            const { currentPassword, newPassword } = req.body;
            try {
                //find user by id
                const user = Model.findById(userId);
                // check if curretn password is correct
                const isMatch = await passwordUtils.compare_password(currentPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Current password is incorrect' });
                }

                //check new_password with hashed one
                const isSamePassword = await passwordUtils.compare_password(newPassword, hashedPassword);

                if (isSamePassword) {
                    return res.status(400).json({ message: 'New password cannot be the same as the current password' });
                }
                await Model.findByIdAndUpdate(
                    userId,
                    {
                        password: await passwordUtils.gen_password(req.body.password),
                        passwordChangedAt: Date.now()
                    },
                    { new: true }
                );
                return res.status(200).json({ message: "Password updated successfully" });
            }
            catch (error) {
                return res.status(400).json({
                    message: error.message
                });
            }
        }
    }
    // add test result by certain doctor for certain patient
    static async addTest(req, res) {
        try {
            const { patientId, title, testitems } = req.body;
            const newtestResult = new testResults({
                patientId,
                title,
                testitems,
                createdby: req.user.id,
            });
            const savedResult = await newtestResult.save();
            const test = {
                patientId: savedResult.patientId,
                title: savedResult.title,
                testItems: savedResult.testitems,
                doctorId: savedResult.doctorId,
                Date: savedResult.date
            }
            return res.status(201).json({ message: "Test Results added successfully", test_details: test });

        }
        catch (err) {
            if (err.name === "ValidationError") {
                const errors = formatValidationErrors(err);
                return res.status(400).json({ message: errors });
            }
            else {
                return res.status(400).json({ message: err.message });
            }
        }

    }
    // get test result by id
    static async getTest(req, res) {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        try {
            const testResult = await testResults.findById(req.params.id)
                .select('patientId title testitems doctorId date');
            if (!testResult) {
                return res.status(404).json({
                    error: `No test with this id ${id}`
                });
            }
            return res.status(200).json({ testResult });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }

    }
    // update test by id
    static async updateTest(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        try {

            const { testName, updates } = req.body;
            const updateFields = {};
            for (const [key, value] of Object.entries(updates)) {
                updateFields[`testitems.$.${key}`] = value; // Use positional operator
            }

            const updatedTestResult = await testResults.findOneAndUpdate(
                { _id: req.params.id, "testitems.testName": testName },
                { $set: updateFields },
                { new: true } // Return the updated document
            );


            if (!updatedTestResult) {
                return res.status(404).json({ error: "Test result not found" });
            }
            return res.status(200).json({ message: "Test Result updated successfully", updatedTestResult });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }

    }
    // delete test by id
    static async deleteTest(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        try {
            const deletedResult = await testResults.findByIdAndDelete(req.params.id);
            if (!deletedResult) {
                return res.status(404).json({ error: "Test result not found" });
            }
            return res.status(200).json({ message: "Test Result deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // get all tests by certain doctor using pagination
    static async getTestsbyDoctor(req, res) {
        const { limit = 5, page } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const testresults = await testResults.find({ createdby: req.user.id })
                .skip(skip)// skip certain results based on skip value
                .limit(parseInt(limit))// limit no of resylts returned
                .populate("patientId", "name dateOfBirth");
            if (testresults.length === 0) {
                return res.status(404).json({ message: "No test results found for this doctor" });
            }
            const total_tests = await testResults.countDocuments();
            const totalPages = Math.ceil(total_tests / limit);
            const filteredTests = testresults.map(result => ({
                // _id: result._id,
                title: result.title,
                testItems: result.testitems.map(item => ({
                    testName: item.testName,
                    Result: item.result,
                    Unit: item.unit,
                    Ref_Range: item.referenceRange
                })),
                date: result.date,
                Created_by: result.createdby
            }));
            res.status(200).json({
                message: `Reteriving ${testresults.length}`, total_pages: totalPages,
                current_page: page, tests: testresults
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }

    }
    // get all tests of certain patient made by certain doctor
    static async AllPatientTestsbyDoctor(req, res) {
        const { patientid } = req.params;
        try {
            const patient = await patientModel.findById(patientid, "name dateOfBirth gender");
            if (!patient) {
                return res.status(404).json({ success: false, message: "Patient not found" });
            }
            const testresults = await testResults.find({
                createdby: req.user.id,
                patientId: patientid,
            });

            if (testresults.length === 0) {
                return res.status(404).json({ message: "No test results found for this doctor" });
            }
            const response = {
                patient: {
                    id: patient._id,
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                },
                tests: testresults,
            };
            res.status(200).json({
                message: "Test results retrieved successfully",
                response,
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //***Patient Controller ******
    // patient gets certain test result 
    static async getPatientTest(req, res) {
        const { testid } = req.params;
        try {
            const testresults = await testResults.find({
                _id: testid,
                patientId: req.user.id
            }).populate("patientId", "name gender dateOfBirth"); // Include age and other desired fields

            if (testresults.length === 0) {
                return res.status(404).json({ message: "No test results found for this patient" });
            }

            res.status(200).json({
                message: "Test results retrieved successfully",
                testresults,
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // get all tests results for certain patient
    static async AllTestsbyPatient(req, res) {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        try {
            const testresults = await testResults.find({
                patientId: req.user.id
            }).populate("patientId", "name gender dateOfBirth");
            if (testresults.length === 0) {
                return res.status(404).json({ message: "No test results found for this patient" });
            }

            res.status(200).json({
                message: "Test results retrieved successfully",
                testresults,
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // patient books home visit
    static async bookVisit(req, res) {
        const { address, visitDate } = req.body;
        try {
            const patient = await patientModel.findById(req.user.id);
            if (!patient) {
                return res.status(404).json({ success: false, message: "Patient not found" });
            }
            if (!address) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const parsedVisitDate = new Date(visitDate);
            const homeVisit = new homeVisitModel({
                patient: req.user.id,
                address,
                visitDate: parsedVisitDate,
            });
            const visit = await homeVisit.save();

            const formattedVisitDate = parsedVisitDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
            await sendEmail(patient.email, formattedVisitDate);
            res.status(201).json({
                message: "Home visit booked successfully", Visit_details: visit
            });
        }
        catch (err) {
            res.status(500).json({ error: "Server error: " + err.message });
        }
    }
}

export default userController;