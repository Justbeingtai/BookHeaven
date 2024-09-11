const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

// Route for getting the homepage
router.get('/', async (req, res) => {
  try {
    // Fetch all projects and include associated user data
    const projectData = await Project.findAll({
      include: [{ model: User, attributes: ['name'] }],
    });

    // Serialize data for the template
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Render the homepage with projects and login status
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err); // Send error response if query fails
  }
});

// Route for getting a specific project by ID
router.get('/project/:id', async (req, res) => {
  try {
    // Fetch project by ID and include user data
    const projectData = await Project.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name'] }],
    });

    const project = projectData.get({ plain: true });

    // Render the project page with the data
    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err); // Send error response if query fails
  }
});

// Route for getting the profile page (requires authentication)
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Fetch the logged-in user's data based on session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] }, // Exclude sensitive data
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    // Render the profile page with user data
    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err); // Send error response if query fails
  }
});

// Route for the login page
router.get('/login', (req, res) => {
  // If user is already logged in, redirect to profile
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  // Render the login page
  res.render('login');
});

module.exports = router;
