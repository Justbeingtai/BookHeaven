const express = require('express');
const router = express.Router();
const { Review } = require('../../models');

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { user_id, book_id, rating, comment } = req.body; // Make sure you're sending user_id and book_id in the request body

    // Create the review
    const newReview = await Review.create({
      user_id,
      book_id,
      rating,
      comment,
    });

    res.status(201).json(newReview); // Return newReview, not review
  } catch (error) {
    console.error('Error creating review:', error); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error('Error updating review:', error); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Delete the review
    await review.destroy();

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting review:', error); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
