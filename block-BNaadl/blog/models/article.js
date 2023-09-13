const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  author: String,
  likes: { type: Number, minlength: 0 },
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
