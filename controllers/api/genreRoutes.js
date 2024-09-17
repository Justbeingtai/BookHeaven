const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

// Route to fetch popular books for a genre
router.get('/genres', async (req, res) => {
  const genre = req.query.genre;

  try {
    // Fetch books based on genre from Google Books API
    const googleBooksResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `subject:${genre}`, // Fetch books by genre
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 10 // Limit the number of results
      }
    });

    const books = googleBooksResponse.data.items;
    const logged_in = req.session ? req.session.logged_in : false;

    // Render the genre page with the books
    res.render('genre-page', {
      books,
      genre,
      logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching books for the genre' });
  }
});

module.exports = router;
