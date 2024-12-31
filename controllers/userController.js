import passwordUtils from '../utils/passwordUtils.js';
import testResults from '../models/TestResults.js';
import homeVisitModel from '../models/HomeVisit.js';
class userController {
    // user updates its password
    static updatePassword(Model) {
        return async (req, res) => {
            const userId = req.params.id;
            try {
                const updateddocument = await Model.findByIdAndUpdate(
                    userId,
                    {
                        password: await passwordUtils.gen_password(req.body.password),
                        passwordChangedAt: Date.now();
                    },
                    { new: true }
                );
                return res.status(200).json({ data: updateddocument });
            }
            catch (error) {

            }
        }
    }
    // add test result by certain doctor for certain patient
    static async addTest(req, res) {
        try {
            const { patientId, doctorId, title, items, createdby } = req.body;
            const newtestResult = new testResults({
                patientId,
                doctorId,
                title,
                items,
                createdby
            });
            const savedResult = await newtestResult.save();
            return res.status(201).json({ message: "Test Results added successfully", test: savedResult });

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
            const testResult = await testResults.findById(req.params.id);
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
            const updatedResult = await testResults.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedResult) {
                return res.status(404).json({ error: "Test result not found" });
            }
            return res.status(200).json({ message: "Test Result updated successfully", updatedResult });
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
    // get all tests by certain doctor
    static async getTestsbyDoctor(req, res) {
        const { doctorid } = req.params;
        if (!mongoose.Types.ObjectId.isValid(doctorid)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        try {
            const testResults = await testResults.find({ createdby: doctorid }).populate("patient", "name email");
            if (testResults.length === 0) {
                return res.status(404).json({ message: "No test results found for this doctor" });
            }

            res.status(200).json({
                message: "Test results retrieved successfully",
                testResults,
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }

    }
    // get all tests of certain patient made by certain doctor
    static async AllPatientTestsbyDoctor(req, res) {
        const { patientid, doctorid } = req.params;
        try {
            const testResults = await testResults.find({
                patient: patientid,
                createdby: doctorid
            }).populate("patient", "name email").populate("createdBy", "name email");
            if (testResults.length === 0) {
                return res.status(404).json({ message: "No test results found for this doctor" });
            }

            res.status(200).json({
                message: "Test results retrieved successfully",
                testResults,
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
        const { patientid, testid } = req.params;
        try {
            const testResults = await testResults.findOne({
                _id: testid,
                patient: patientid
            }).populate({
                path: "patient",
                select: "name gender age", // Include age and other desired fields
            });
            if (testResults.length === 0) {
                return res.status(404).json({ message: "No test results found for this doctor" });
            }

            res.status(200).json({
                message: "Test results retrieved successfully",
                testResults,
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    // patient books home visit
    static async bookVisit(req, res) {
        const { patientId, address } = req.body;
        if (!patientId || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const homeVisit = new homeVisitModel({
            patient: patientId,
            address
        }).populate("patient", "name email")
        await homeVisit.save();
        res.status(201).json({
            message: "Home visit booked successfully", Visit_details: homeVisit
        });
    } catch(err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
}


export default userController;