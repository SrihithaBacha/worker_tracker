const User = require('../models/employee'); // Adjust the path as necessary

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    const data = req.body;
    try {
        const user = new User(data);
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const users = await User.find({});
        // console.log(users);
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getEmployeeById,
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
};