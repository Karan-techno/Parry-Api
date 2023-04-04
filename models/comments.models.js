module.exports = mongoose => {
    const commentSchema = new mongoose.Schema({
        text: {
          type: String,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        spotFlow: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SpotFlow',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      });
    const comment = mongoose.model("Comments", commentSchema);
    return comment;
}