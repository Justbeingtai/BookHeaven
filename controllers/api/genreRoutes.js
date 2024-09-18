const router = require('express').Router();
const axios = require('axios');

// Number of books per page
const BOOKS_PER_PAGE = 10;

router.get('/:genre', async (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.query.page) || 1; // Get the page number from the query, default to 1

  try {
    // Fetch books from Google Books API based on the genre
    const startIndex = (page - 1) * BOOKS_PER_PAGE; // Calculate the starting index for pagination

    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q: `subject:${genre}`,
        startIndex: startIndex,
        maxResults: BOOKS_PER_PAGE,
        key: process.env.GOOGLE_BOOKS_API_KEY
      }
    });

    // Check if the response contains valid data
    if (!response.data || !response.data.items) {
      throw new Error('No books found for this genre');
    }

    const totalItems = response.data.totalItems; // Total number of books available
    const totalPages = Math.ceil(totalItems / BOOKS_PER_PAGE); // Calculate total pages

    // Map the book data
    const books = response.data.items.map(book => ({
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
      publishedDate: book.volumeInfo.publishedDate || 'Unknown Date',
      image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '/images/default-book.png',
      infoLink: book.volumeInfo.infoLink,
    }));

    // Pagination logic
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.render('genre-page', {
      books,
      genre,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage: page - 1,
      nextPage: page + 1,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(`Error fetching books: ${err.message}`);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

module.exports = router;
