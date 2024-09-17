const router = require('express').Router();
const chatRoutes = require('./chatRoutes');
const bookRoutes = require('./bookRoutes');
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const blogRoutes = require('./blogRoutes'); 
const searchRoutes = require('./searchRoutes');

// Mount the API routes
router.use('/chats', chatRoutes);
router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/blogs', blogRoutes); 
router.use('/search', searchRoutes);

module.exports = router;
