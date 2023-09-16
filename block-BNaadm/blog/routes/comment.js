var Article = require('../models/article');
var Comment = require('../models/comment');
const express = require('express');
const router = express.Router();

/* -----Edit (Update) comments----- */

/* -----1: GET an update form for a comment----- */
router.get('/:commentid/edit', async (req, res, next) => {
  var commentID = req.params.commentid;
  var oneCommentObj = await Comment.findById(commentID);
  console.log(oneCommentObj);
  res.render('updateCommentForm', { oneCommentObj });
});
/* -----2. Store the updated comment in DB----- */
router.post('/:commentid', async (req, res, next) => {
  var commmentId = req.params.commentid;
  var updatedComment = await Comment.findByIdAndUpdate(commmentId, req.body);
  res.redirect('/articles/' + updatedComment.articleId);
});

/* -----Delete comments----- */
/* -----Old Way----- */
// router.get('/:commentid/delete', async (req, res, next) => {
//   var commentId = req.params.commentid;
//   var deletedComment = await Comment.findByIdAndRemove(commentId);
//   res.redirect('/articles/' + deletedComment.articleId);
// });

/* -----New Way using populate()----- */
router.get('/:commentid/delete', async (req, res, next) => {
  var commentId = req.params.commentid;
  var deletedComment = await Comment.findByIdAndRemove(commentId);
  var updatedArticle = await Article.findByIdAndUpdate(
    deletedComment.articleId,
    { $pull: { comments: deletedComment._id } }
  );
  res.redirect('/articles/' + deletedComment.articleId);
});

module.exports = router;
