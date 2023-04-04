const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = 'your-secret-key';

const userSchema = Schema(
  {
    // fname : String,
    // lname : String,
    // email : String,
    // password : String,
    number:{
      type:String,
       required:true,} 
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    secretKey,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports.Usermodel = model("Usermodel", userSchema);