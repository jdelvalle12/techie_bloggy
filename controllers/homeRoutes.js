const router = require('express').Router();
const { Comment, User, Blog } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user data
    const blogData = await Blog.findAll({
      attributes: ['id','title', 'username', 'content', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: [
            'comment_text','date_created',
          ],
          include: [{
            model: User,
            attributes: ['username']
          }],
        },
      ],
    });

    // Serialize data so the template can read it
    const allBlogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      allBlogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blogs', async (req, res) => {
  try {

const blogData = await Blog.findAll({
  attributes: ['id', 'title', 'content', 'date_created'],
  include: [
    {
      model: User,
      attributes: ['username'],
    },
    {
      model: Comment,
      attributes: ['comment_text', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    },
  ],
  where: {
    user_id: req.session.user_id,
  },
});
// Serialize data so the template can read it
const allBlogs = blogData.map((blog) => blog.get({ plain: true }));

// Pass serialized data and session flag into template
res.render('blog', { 
  allBlogs, 
  logged_in: req.session.logged_in 
  });
} catch (err) {
res.status(500).json(err);
}
});

router.get('/blogs/:id', async (req, res) => {
  try {

const blogData = await Blog.findAll({
  attributes: ['id', 'title', 'username', 'content', 'date_created'],
  include: [
    {
      model: User,
      attributes: ['username'],
    },
    {
      model: Comment,
      attributes: ['comment_text', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    },
  ],
  where: {
    user_id: req.session.user_id,
  },
});
// Serialize data so the template can read it
const allBlogs = blogData.map((blog) => blog.get({ plain: true }));

// Pass serialized data and session flag into template
res.render('blog', { 
  allBlogs, 
  logged_in: req.session.logged_in 
  });
} catch (err) {
res.status(500).json(err);
}
});

router.get('/blogs/:id/comments', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['comment_text', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

    res.render('login');
});

module.exports = router;
