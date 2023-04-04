const validator = require("validator");

module.exports = mongoose => {
    var Parry = mongoose.Schema({
        name: String,
        email : {
            type:String,
            // required:true,
            unique:true, 
            // validate(value){
            //     if(!validator.isEmail(value)){
            //         throw new Error("Email is already exists")
            //     }
            // }
        },
        password:String,
        // password : {
        //     type:String,
        //     required:true,
            // unique:true,
            // validate(value){
            //     if(!validator.isLength(value, {min:8, max:10})){
            //         throw new Error("password min length is 8")
            //     }
            // }
        // },
        // address : String,
        phoneNumber: String
        
    });
    const userSchema = mongoose.model("Parry", Parry);
    return userSchema;
}