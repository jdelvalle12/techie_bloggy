const router = require('express').Router();
const { Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', withAuth, async (req, res) => {
  try {
    const blogPosts = await Blog.findAll({
      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'date_created', 'user_id'],
        },
      ],
    });

    res.render('homepage', { blogPosts });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/blog-posts', withAuth, async (req, res) => {
  try {
    const blogPosts = await Blog.findByPk();

    res.status(200).json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const currentDate = new Date(); //get the current date and time
    const newblog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
      date_created: currentDate //set the date_created field to the current date and time
    });

    res.status(200).json(newblog);
  } catch (err) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData[0]) {
      res.status(404).json({ message: 'No Blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No Blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
