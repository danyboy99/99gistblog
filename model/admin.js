const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const adminSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
});

//hash password
adminSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

adminSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const user = mongoose.model("admin", adminSchema);

module.exports = user;
