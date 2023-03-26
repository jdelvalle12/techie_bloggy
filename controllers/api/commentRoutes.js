const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/:blog_id/comments', withAuth, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        blog_id: req.params.blog_id,
      },
      include: [{ model: User, attributes: ['username'] }]
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/:blog_id/comments', withAuth, async (req, res) => {
  try {
    const currentDate = new Date(); //get the current date 
    const newComment = await Comment.create({
      ...req.body,
      blog_id: req.params.blog_id,
      user_id: req.session.user_id,
      date_created: currentDate //set the date_created field to the current date 
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new comment from the homepage
router.post('/:blog_id/comments', withAuth, async (req, res) => {
  try {
    const {comment_text} = req.body;
    if (!comment_text) {
      return res.status(400).json({message: 'Comment text is required'});
    }
    
    const currentDate = new Date(); //get the current date and time
    const newComment = await Comment.create({
      ...req.body,
      blog_id: req.body.blog_id,
      user_id: req.session.user_id,
      date_created: currentDate //set the date_created field to the current date and time
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;