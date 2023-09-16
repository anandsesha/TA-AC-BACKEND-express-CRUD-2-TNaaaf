var Article = require('../models/article');
var Comment = require('../models/comment');
const express = require('express');
const router = express.Router();

/* Display all articles in db in a  list. Any button of form where /articles is used this router takes care */
router.get('/', async (req, res, next) => {
  var allArticlesArray = await Article.find({});
  //   console.log(allArticlesArray);
  res.render('articles', { allArticlesArray });
});

/* Give the client a form to add an article */
router.get('/new', function (req, res, next) {
  res.render('createArticle');
});

// Store data coming from form in DB and show in Article List page.
// (Hence it will do  a post request on `/` and also in createarticle.ejs we give action="/articles" which is `/`)
router.post('/', async (req, res, next) => {
  //   tags data stored as array of strings (comes are strings separated by comma in UI) stored inside req.body.tags how usually form data is stored
  req.body.tags = req.body.tags.trim().split(' ');
  //   console.log(req.body);
  let newArticle = await Article.create(req.body);
  res.redirect('/articles');
});

/* -------------  2. Display single Article details ------------- */
// router.get('/:id', async (req, res, next) => {
//   try {
//     var id = req.params.id;
//     var singleArticleObj = await Article.findById(id);
//     // console.log(singleArticleObj); // {...}
//     res.render('singleArticleDetails', { singleArticleObj });
//   } catch (err) {
//     next('Cant fetch single Article');
//   }
// });

/* ---------- Update (EDIT) article via form -------------*/
//When edit button (inside SingleArticleDetails page or somehwere else) is clicked,
//using id of the article in DB, find it, and edit it via form
router.get('/:articleid/edit', async (req, res, next) => {
  var id = req.params.articleid;
  var oneArticle = await Article.findById(id); // {...}
  //   console.log(oneArticle);
  //since in DB, tags are stored like this ['node','js'] -> join(' ') converts to -> 'node js'
  //   oneArticle.tags = oneArticle.tags.join(' ');
  res.render('editArticleForm', { oneArticle });
});

//Edit user button clicked. Form data coming to action='/articles/<%= oneArticle._id %>'
// Now have to save edited data to DB
router.post('/:id', async (req, res, next) => {
  try {
    var id = req.params.id;
    // Again, edited form data - tags, also comes in as string. so put it in an array and save to DB
    req.body.tags = req.body.tags.split(' ');
    var updatedArticle = await Article.findByIdAndUpdate(id, req.body); //the 2 parms are :- (id to update, the data coming from Edit user page which has to be updated with)
    res.redirect('/articles');
  } catch (err) {
    next('Edited Article not saved in DB');
  }
});

/* ---------- Delete Article via <a> button -------------*/
//this .get is invoked using Delete button on singleArticleDetails.ejs page
router.get('/:id/delete', async (req, res, next) => {
  try {
    var id = req.params.id;
    var deletedArticle = await Article.findByIdAndDelete(id);
    // Handle cross-referrencing -> delet article's comments as well as below:-
    await Comment.deleteMany({ articleId: deletedArticle.id });
    res.redirect('/articles');
  } catch (err) {
    next('Article not Deleted from DB');
  }
});

// Handle Likes
router.get('/:id/likes', async (req, res, next) => {
  try {
    var id = req.params.id;
    await Article.findByIdAndUpdate(id, { $inc: { likes: 1 } });
    res.redirect(`/articles/` + id);
  } catch (err) {
    next(`Error incrementing likes for this article`);
  }
});

/* -----Add (CREATE) comments----- */
router.post('/:articleid/comments', async (req, res, next) => {
  console.log(req.body);
  var articleId = req.params.articleid;
  req.body.articleId = req.params.articleid;
  console.log(req.body.articleid);
  // store to DB
  let oneComment = await Comment.create(req.body);
  // Cross reference - when you create a comment associate with the parent Article as well
  var updatedArticle = await Article.findByIdAndUpdate(articleId, {
    $push: { comments: oneComment._id },
  });
  res.redirect('/articles/' + req.params.articleid);
});

/* -----List (GET) comments----- */
/* -----Old way----- */
// router.get('/:articleid', async (req, res, next) => {
//   console.log(req.body);
//   var articleId = req.params.articleid;
//   var singleArticleObj = await Article.findById(articleId);
//   //using the articleid you have found all the comments in that article as shown below
//   var allComments = await Comment.find({ articleId: articleId });
//   // console.log(allComments);
//   res.render('singleArticleDetails', {
//     singleArticleObj,
//     allComments,
//   });
// });
/* -----NEW way - using populate()----- */
router.get('/:articleid', async (req, res, next) => {
  console.log(req.body);
  var articleId = req.params.articleid;
  var singleArticleObj = await Article.findById(articleId)
    .populate('comments')
    .exec();
  //using the articleid you have found all the comments in that article as shown below
  var allComments = await Comment.find({ articleId: articleId });
  // console.log(allComments);
  res.render('singleArticleDetails', { singleArticleObj });
});

/* -----Edit (Update) comments----- */
/* -----1: GET an update form for a comment----- */
/* -----2. Store the updated comment in DB----- */

// Both update and Delete done inside separate route -> refer comment.js

module.exports = router;
