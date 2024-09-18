const router = require('express').Router();
const axios = require('axios');
require('dotenv').config(); // Load .env variables

// Route for searching books via Google Books API
router.get('/', async (req, res) => { // Change '/search' to '/'
  try {
    const query = req.query.query; // The search term from the form

    // Fetch results from Google Books API
    const googleBooksResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query, // Search query
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 10, // Number of results to return
      }
    });

    // Extract books from the Google Books API response
    const googleBooks = googleBooksResponse.data.items || [];

    const logged_in = req.session ? req.session.logged_in : false;

    // Render the search-results page with the Google Books data
    res.render('search-results', {
      googleBooks, // Pass books data to Handlebars
      query, // The search term
      logged_in, // Session status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching search results' });
  }
});


module.exports = router;
