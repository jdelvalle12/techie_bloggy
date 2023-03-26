const router = require('express').Router();
const { Blog, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

// router.get('/', withAuth, async (req, res) => {
//   try {
//     const blogPosts = await Blog.findAll();

//     res.status(200).json(blogPosts);
//   } catch (err) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.get('/blogs', withAuth, async (req, res) => {
  try {
    const blogPosts = await Blog.findAll({
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'date_created', 'user_id', 'blog_id'],
          include: [{ model: User, attributes: ['username']}]
        },
      ],
    });

    res.status(200).json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/blogs/:id', withAuth, async (req, res) => {
  try {
    const blogPost = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'date_created', 'user_id', 'blog_id'],
          include: [{ model: User, attributes: ['username']}]
        },
      ],
    });

    if (!blogPost) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.status(200).json(blogPost);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// router.post('/', withAuth, async (req, res) => {
//   try {
//     const currentDate = new Date(); //get the current date and time
//     const newblog = await Blog.create({
//       ...req.body,
//       user_id: req.session.user_id,
//       date_created: currentDate //set the date_created field to the current date and time
//     });

//     res.status(200).json(newblog);
//   } catch (err) {
//     res.status(500).json({message: 'Internal Server Error'});
//   }
// });

router.post('/blogs', withAuth, async (req,res) => {
  try {
    const currentDate = new Date();
    const newBlog = await Blog.create({
      ...req.body,
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
      date_created: currentDate
    });
    res.status(200).json(newBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/blogs/:id', withAuth, async (req, res) => {
  try {
    const currentDate = new Date();
    const blogData = await Blog.update({
      ...req.body,
      date_updated: currentDate
    }, {
     where: {
       id: req.params.id,
       user_id: req.session.user_id,
     },      
    });

    if (!blogData [0]) {
      res.status(404).json({ message: 'No Blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/blogs/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'Blog post deleted successfully!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
