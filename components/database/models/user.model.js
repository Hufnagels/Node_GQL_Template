const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { isAlphanumeric, isEmail } = require('validator');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    // username: { type: String, required: true, unique: true, maxLength: 20, trim: true, validate: [isAlphanumeric, 'Usernames may only have letters and numbers.'] },
    firstName: { type: String, required: true, maxLength: 100, trim: true },
    lastName: { type: String, required: true, maxLength: 100, trim: true },
    date_of_birth: { type: String },
    email: { type: String, required: true, unique: true, validate: [isEmail, 'invalid email'], },
    password: { type: String },
    token: { type: String },
  },
  {
    timestamps: true
  },
  {
    collection: 'users'
  }
);
userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};
// methods ======================
// // generating a hash. We hash password within user model, before it saves to DB.
// userSchema.methods.generateHash = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
// }

// // checking if password is valid
// userSchema.methods.validPassword = function (password) {
//   return bcrypt.compareSync(password, this.local.password)
// }

//export default UserSchema
const Users = mongoose.model("Users", userSchema);
module.exports = Users