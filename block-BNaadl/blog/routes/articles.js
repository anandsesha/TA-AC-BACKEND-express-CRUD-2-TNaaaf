var Article = require('../models/article');
const express = require('express');
const router = express.Router();

/* GET articles list. */
router.get('/', function (req, res, next) {
  res.render('articles');
});

/* GET articles list. */
router.get('/new', function (req, res, next) {
  res.render('createArticle');
});

// Store data coming from form in DB and show in Article List page
router.post('/new', async (req, res, next) => {
  console.log(req.body);
  let newArticle = await Article.create(req.body);
  res.render('articles', { newArticle });
});

// router.post();
module.exports = router;
