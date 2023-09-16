var Author = require('../models/author');
var Book = require('../models/book');
var express = require('express');
var router = express.Router();

/* GET to home page from Book List page. */
router.get('/index', function (req, res, next) {
  res.render('index');
});

/* ---------- List (GET) all Book ------------*/
router.get('/', async (req, res, next) => {
  var allBooks = await Book.find({});
  res.render('books', { allBooks });
});

/* ---------- Create New Book ------------*/
//render a create form
router.get('/new', async (req, res, next) => {
  res.render('createBookForm');
});
//and redirect it to all books page
router.post('/', async (req, res, next) => {
  console.log(req.body);
  await Book.create(req.body);
  res.redirect('books');
});

module.exports = router;
