module.exports = mongoose => {
    var SpotSchema = mongoose.Schema({
        type: String,
        tag : String,
        image:String,
        description:String,
        upvote:String,
        user:String
        
    });
    const spotFlows = mongoose.model("spotFlows", SpotSchema);
    return spotFlows;
}