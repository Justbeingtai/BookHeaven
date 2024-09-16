const router = require('express').Router();
const { Books } = require('../../models');

// Route to create a new book
router.post('/', async (req, res) => {
  try {
    const newBook = await Books.create(req.body); // Creates a new book
    res.status(201).json(newBook);               // Respond with the created book
  } catch (err) {
    res.status(400).json(err);                   // Handle validation errors
  }
});

// Route to get all books
router.get('/', async (req, res) => {
  console.log()
  try {
    const booksData = await Books.findAll();
    const books = booksData.map((books) => books.get({ plain: true })); 
    console.log(books)       // Fetch all books
    res.render('booksPage', { 
      books
    });               // Respond with book data
  } catch (err) {
    res.status(500).json(err);                    // Send error if query fails
  }
});

// Route to get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const bookData = await Books.findByPk(req.params.id); // Fetch book by ID
    if (!bookData) {
      res.status(404).json({ message: 'No book found with this id!' });
      return;
    }
    const book = bookData.get({ plain: true });
    res.render('booksDetails', { 
      book
    });               // Respond with the book data
  } catch (err) {
    res.status(500).json(err);                    // Send error if query fails
  }
});

// Route to update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Books.update(req.body, {
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
    const deletedBook = await Books.destroy({
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
