const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  author: String,
  likes: { type: Number, default: 0 },
  // cross-referenced with comments model
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
