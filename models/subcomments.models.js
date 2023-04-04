module.exports = mongoose => {
    const subCommentSchema = new mongoose.Schema({
        text: {
          type: String,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment'
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      });
    const subcomment = mongoose.model("sub-Comments", subCommentSchema);
    return subcomment;
}