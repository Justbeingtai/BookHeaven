const sequelize = require('../config/connection');
const { Blogs } = require('../models'); // Remove Books
const blogsData = require('./blogsData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  for (const blogs of blogsData) {
    await Blogs.create({
      ...blogs,
    });
  }

  process.exit(0);
};

seedDatabase();
