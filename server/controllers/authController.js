const { findUserByRole } = require('../services/authService');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  console.log(req.body)
  const { email, password, role } = req.body;

  try {
    const userdetails = await findUserByRole(role, password,email);
    const user=userdetails[0];
    const userrole=userdetails[1];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(userrole =='employee'){
      const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
       return res.status(200).json({ message: 'Login successful', token , role:role , email:user.email, empId :user.empId, siteId:user.siteId});
    }
    const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token ,role:role ,email:user.email, id :user.id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };
