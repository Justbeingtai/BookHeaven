const router = require('express').Router();
const { User } = require('../../models'); // Correct import

// Route to create a new user (Sign-Up)
router.post('/', async (req, res) => {

  try {
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Save user session after sign-up
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData); // Return created user
    });
} catch (err) {
    console.log('Error during sign-up:', err); // Log the error

    // Handle duplicate email error
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email is already in use. Please try a different email.' });
    } else if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred during sign-up.' });
    }
  }
});


// User login
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } }); // Use 'email' here

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// User logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
