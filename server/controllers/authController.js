const { findUserByRole } = require('../services/authService');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  console.log(req.body)
  const { email, password, role } = req.body;

  try {
    const user = await findUserByRole(role, password,email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token ,role:role});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };