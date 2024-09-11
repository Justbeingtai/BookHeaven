const router = require('express').Router();
const { Book } = require('../../models');

// Route to create a new book
router.post('/', async (req, res) => {
  try {
    const newBook = await Book.create(req.body); // Creates a new book
    res.status(201).json(newBook);               // Respond with the created book
  } catch (err) {
    res.status(400).json(err);                   // Handle validation errors
  }
});

// Route to get all books
router.get('/', async (req, res) => {
  try {
    const bookData = await Book.findAll();        // Fetch all books
    res.status(200).json(bookData);               // Respond with book data
  } catch (err) {
    res.status(500).json(err);                    // Send error if query fails
  }
});

// Route to get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const bookData = await Book.findByPk(req.params.id); // Fetch book by ID
    if (!bookData) {
      res.status(404).json({ message: 'No book found with this id!' });
      return;
    }
    res.status(200).json(bookData);               // Respond with the book data
  } catch (err) {
    res.status(500).json(err);                    // Send error if query fails
  }
});

// Route to update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.update(req.body, {
      where: { id: req.params.id },               // Update book where ID matches
    });
    if (!updatedBook) {
      res.status(404).json({ message: 'No book found with this id!' });
      return;
    }
    res.status(200).json(updatedBook);            // Respond with the updated book
  } catch (err) {
    res.status(500).json(err);                    // Send error if update fails
  }
});

// Route to delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.destroy({
      where: { id: req.params.id },               // Delete book where ID matches
    });
    if (!deletedBook) {
      res.status(404).json({ message: 'No book found with this id!' });
      return;
    }
    res.status(204).end();                        // Send 204 No Content after deletion
  } catch (err) {
    res.status(500).json(err);                    // Send error if delete fails
  }
});

module.exports = router;
