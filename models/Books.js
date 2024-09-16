const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Book extends Model {}

// Define the schema for the Book model
Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true, // Adds createdAt and updatedAt timestamps
    freezeTableName: true, // Prevents table name from being pluralized
    underscored: true, // Uses snake_case column names
    modelName: 'book', // Sets the table name to 'book'
  }
);

module.exports = Book;
