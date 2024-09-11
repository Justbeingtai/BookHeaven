const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// Mount homeRoutes at the base path ('/')
router.use('/', homeRoutes);

// Mount API routes at '/api'
router.use('/api', apiRoutes);

module.exports = router;
