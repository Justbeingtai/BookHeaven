// controllers/api/blogRoutes.js
const router = require('express').Router();
const { Blogs, User } = require('../../models');

// Route to create a new blog post
router.post('/', async (req, res) => {
  try {
    const newBlog = await Blogs.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id, // Use the logged-in user's ID
    });
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating blog post:', err); // Log the error details
    res.status(400).json({ message: 'Failed to create blog post', error: err });
  }
});

// Route to get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogData = await Blogs.findAll({
      include: {
        model: User,
        attributes: ['name'],
      },
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('blogpage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    console.error('Error fetching blogs:', err); // Log the full error message
    res.status(500).json({ error: err.message }); // Return error message in response
  }
});

// Route to get a single blog post by ID and render the blog details page
router.get('/:id', async (req, res) => {
  try {
    const blogData = await Blogs.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['name'],
      },
    });
    
    if (!blogData) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    const blog = blogData.get({ plain: true });
    res.render('blogdetails', { // Render the blogdetails.handlebars
      blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error('Error fetching single blog:', err); // Log any errors
    res.status(500).json(err);
  }
});

// Route to update a blog post
router.put('/:id', async (req, res) => {
  try {
    const updatedBlog = await Blogs.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updatedBlog) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blogs.destroy({
      where: { id: req.params.id },
    });
    if (!deletedBlog) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
