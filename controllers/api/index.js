const router = require('express').Router();
const chatRoutes = require('./chatRoutes');
const bookRoutes = require('./bookRoutes');
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const blogRoutes = require('./blogRoutes'); // Add blog routes

// Mount the API routes
router.use('/chats', chatRoutes);
router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/blogs', blogRoutes); // Use /blogs for blog-related routes

module.exports = router;
