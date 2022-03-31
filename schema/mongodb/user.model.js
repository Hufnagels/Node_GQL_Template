const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, maxLength: 100, unique: true, trim: true},
    first_name: {type: String, required: true, maxLength: 100, trim: true},
    family_name: {type: String, required: true, maxLength: 100, trim: true},
    date_of_birth: {type: Date},
    email: { type: String, required: true, unique: true},
    password: {type: String},
  },
  {
    timestamps: true
  }
);

// methods ======================
// generating a hash. We hash password within user model, before it saves to DB.
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

//export default UserSchema
module.exports = mongoose.model("users", userSchema);