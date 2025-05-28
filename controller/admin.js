const Admin = require("../model/admin");

const createAdmin = async (req, res) => {
  const { email, password, name, username } = req.body;

  const createdAdmin = await Admin.create({
    email,
    password,
    name,
    username,
  });
};
