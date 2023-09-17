var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: { type: String, required: true },
  summary: String,
  pages: Number,
  publication: String,
  cover_image: String, //Stores the filename or path of the cover image
  category: [String],
  author: String,
});

var Book = mongoose.model('Book', bookSchema);
module.exports = Book;
