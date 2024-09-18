const router = require('express').Router();
const axios = require('axios');
const { Review, User } = require('../models');
const { Op } = require('sequelize');
require('dotenv').config(); // Load .env variables

// Homepage route to display top 3 books and their reviews
router.get('/', async (req, res) => {
  try {
    // Fetch top 3 books from Google Books API (e.g., trending books)
    const googleBooksResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: 'top', // Adjust this query to fetch popular books
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 3 // Limit to top 3
      }
    });
    console.log(googleBooksResponse.data);

    const googleBooks = googleBooksResponse.data.items;

    // For each book, fetch reviews from your local database
    const reviewsForBooks = {};
    for (const book of googleBooks) {
      const title = book.volumeInfo.title;

      const reviewResults = await Review.findAll({
        where: {
          comment: {
            [Op.iLike]: `%${title}%` // Match review comments with book titles
          },
        },
        include: {
          model: User,
          attributes: ['name'] // Use 'name' instead of 'username'
        }
      });

      reviewsForBooks[title] = reviewResults.map((review) => review.get({ plain: true }));
    }

    const logged_in = req.session ? req.session.logged_in : false;

    // Render the homepage with top books and their reviews
    res.render('homepage', {
      googleBooks,
      reviewsForBooks,
      logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching top books and reviews' });
  }
});

// Route to fetch trending books with pagination
router.get('/trending-books', async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Get the page number from query params, default is 0
  const limit = 3; // Number of books per page
  const startIndex = page * limit; // Calculate the start index

  try {
    // Fetch the books from Google Books API based on page number
    const googleBooksResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: 'top', // Fetch trending books
        key: process.env.GOOGLE_BOOKS_API_KEY,
        startIndex,
        maxResults: limit,
      }
    });

    const googleBooks = googleBooksResponse.data.items || [];
    
    console.log('Fetched books:', googleBooks);  // Log the fetched books to the console

    // Respond with the new batch of books
    res.json({ googleBooks });
  } catch (err) {
    console.error('Error fetching more books:', err);
    res.status(500).json({ error: 'Error fetching more books' });
  }
});



// Add route for login page
router.get('/login', (req, res) => {
  try {
    // Render the login page
    res.render('login', {
      title: 'Login',
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading login page' });
  }
});

// Add route for signup page
router.get('/signup', (req, res) => {
  try {
    // Render the signup page
    res.render('signup', {
      title: 'Sign Up',
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading signup page' });
  }
});

// Add route for profile page
router.get('/profile', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.logged_in) {
      return res.redirect('/login'); // Redirect to login if not logged in
    }

    // Fetch user data from the database (or pass the session data if already available)
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] }, // Exclude password from response
    });

    const user = userData.get({ plain: true });

    // Render the profile page with the user data
    res.render('profile', {
      title: 'Your Profile',
      user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading profile page' });
  }
});

// Add route for chat page
router.get('/chat', (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.logged_in) {
      return res.redirect('/login'); // Redirect to login if not logged in
    }

    // Render the chat page
    res.render('chat', {
      title: 'Chat Room',
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading chat page' });
  }
});

module.exports = router;
