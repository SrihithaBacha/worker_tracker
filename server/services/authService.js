const SuperAdmin = require('../models/superAdmin');
const SiteAdmin = require('../models/siteAdmin');
const Employee = require('../models/employee');

const findUserByRole = async (role, password,email) => {
  let user;
  
  switch (role) {
    case 'superAdmin':
      user = await SuperAdmin.findOne({ email:email,password:password, isDeleted: false });
      break;
    case 'siteAdmin':
      user = await SiteAdmin.findOne({ email, password,isDeleted: false });
      break;
    case 'employee':
      user = await Employee.findOne({ email,password, isDeleted: false });
      break;
    default:
      throw new Error('Invalid role');
  }
  return [user,role];
};
module.exports = {
  findUserByRole,
};