const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: String,
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    likes: { type: Number },
  },
  { timestamps: true }
);

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
