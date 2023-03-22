const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/:blog_id/comments', withAuth, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        blog_id: req.params.blog_id,
      },
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/:blog_id/comments', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      blog_id: req.params.blog_id,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;