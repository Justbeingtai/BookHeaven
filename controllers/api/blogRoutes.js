// controllers/api/blogRoutes.js
const router = require('express').Router();
const { Blog } = require('../../models'); 

// Route to create a new blog post
router.post('/', async (req, res) => {
  console.log(req.body); // Log the request body
  try {
    const newBlog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      user_id: 1, // Hardcode the user_id to 1 for now
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
    const blogData = await Blog.findAll();
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id);
    if (!blogData) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a blog post
router.put('/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.update(req.body, {
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
    const deletedBlog = await Blog.destroy({
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
