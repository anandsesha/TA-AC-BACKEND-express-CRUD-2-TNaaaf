var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  country: String,
  bookId: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

var Author = mongoose.model('Author', authorSchema);
module.exports = Author;
