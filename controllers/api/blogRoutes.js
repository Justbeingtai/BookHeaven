// controllers/api/blogRoutes.js
const router = require('express').Router();
const { Blogs, User } = require('../../models');

// Route to create a new blog post
router.post('/', async (req, res) => {
  console.log('receiving request body: ', req.body); // Log the request body
  try {
    const newBlog = await Blogs.create({
      title: req.body.title,
      content: req.body.content,
      // maybe add ratings here?
      user_id: req.body.userId,
    });
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating blog post:', err); // Log the error details
    res.status(400).json({ message: 'Failed to create blog post', error: err });
  }
});
// Route to get all blog posts
router.get('/', async (req, res) => {
  console.log('here');
  try {
    const blogsData = await Blogs.findAll({ include: User });
    const blogs = blogsData.map((blogs) => blogs.get({ plain: true }));
    res.render('blogpage', {
      blogs,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get a single blog post by ID
router.get('/:id', async (req, res) => {
  console.log('got here---');
  console.log('the id is: ', req.params.id);
  try {
    const blogData = await Blogs.findOne({
      where: {
        id: req.params.id,
      },
      include: User,
    });
    console.log('blogData: ', blogData);
    if (!blogData) {
      console.log('am i here?');
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }
    // Serialize single data (not array) so the template can read it
    const blog = blogData.get({ plain: true });
    console.log('blog: ', blog);
    console.log(' ');
    res.render('blogDetails', {
      blog,
    });
  } catch (err) {
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
