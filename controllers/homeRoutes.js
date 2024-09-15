const router = require('express').Router();
const { Review, User, Books } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log ("test");
  try {
    // Get all projects and JOIN with user data
    // .findAll() means get all rows 
    // but if you put conditions into it, you can narrow what you want
    const reviewData = await Review.findAll();
    const booksData = await Books.findAll();
    console.log('reviewData: ', reviewData)

    // Serialize data so the template can read it
    const reviews = reviewData.map((review) => review.get({ plain: true }));
    console.log('reviews ', reviews)
    const books = booksData.map((books) => books.get({ plain: true }));
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      reviews, 
      books,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    console.log (err);
    
    res.status(500).json(err);
  }
});

router.get('/review/:id', async (req, res) => {
  try {
    const reviewData = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const review = reviewData.get({ plain: true });

    res.render('review', {
      ...review,
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
      include: [{ model: Review }],
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
