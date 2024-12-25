import doctorModel from '../models/Doctor.js';
import patientModel from '../models/Patient.js';
import testResults from '../models/TestResults.js';
class userController {
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

    static async deleteTest(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        try {
            const deletededResult = await testResults.findByIdAndDelete(req.params.id);
            if (!deletdedResult) {
                return res.status(404).json({ error: "Test result not found" });
            }
            return res.status(200).json({ message: "Test Result deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }

    }
}

export default userController;