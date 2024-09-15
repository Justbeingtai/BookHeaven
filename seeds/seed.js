const sequelize = require('../config/connection');
const { User, Review, Blogs, Books } = require('../models');
// const Blogs = require('../models/Blogs');

// Copy this format: const projectData = require('./projectData.json');
const userData = require('./userData.json');
const reviewData = require('./reviewData.json');
const blogsData = require('./blogsData.json');
const booksData = require('./booksData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // for (const project of projectData) {
  //   await Project.create({
  //     ...project,
  //     user_id: users[Math.floor(Math.random() * users.length)].id,
  //   });
  // }

  const books = await Books.bulkCreate(booksData, {
    individualHooks: true,
    returning: true,
  });

  for (const review of reviewData) {
    console.log('review: ', review)
      await Review.create({
        ...review,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        book_id: books[Math.floor(Math.random() * books.length)].id,
      });

    }

    for (const blogs of blogsData) {
      console.log('blogs: ', blogs)
        await Blogs.create({
          ...blogs,
          user_id: users[Math.floor(Math.random() * users.length)].id,
        });
      }

      
  

  process.exit(0);
};

seedDatabase();
