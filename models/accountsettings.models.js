module.exports = mongoose => {
    var accountSchema = mongoose.Schema({
        email:String,
        // confirmEmail:String,
        password:String,
        // confirmPassword:String,
        mobile:Number,
        otp:String,
    });
    const account = mongoose.model("Account", accountSchema)
    return account;
}