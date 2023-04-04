module.exports = mongoose => {
    var profileSchema = mongoose.Schema({
        name:String,
        profilepic:String,
        ridingstyle:String,
        about:String,

    });
    const profile = mongoose.model("MyProfile",profileSchema)
    return profile;
}