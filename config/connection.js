const Sequelize = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

let sequelize;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL for Render (Production)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Note: Disable strict SSL validation (for self-signed certificates)
      }
    }
  });
} else {
  // Use local database for development
  sequelize = new Sequelize(
    process.env.DB_NAME,      // e.g. 'the_book_heaven'
    process.env.DB_USER,      // e.g. 'postgres'
    process.env.DB_PASSWORD,  // e.g. 'your_password'
    {
      host: 'localhost',
      dialect: 'postgres',
      port: 5432               // Default PostgreSQL port
    }
  );
}

module.exports = sequelize;
