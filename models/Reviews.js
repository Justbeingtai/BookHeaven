const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model {}

// Define the schema for the Review model
Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'book',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,         // Rating is required
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,          // Comment is optional
    },
  },
  {
    sequelize,
    timestamps: true,            // Adds createdAt and updatedAt timestamps
    freezeTableName: true,       // Prevents table name from being pluralized
    underscored: true,           // Uses snake_case column names
    modelName: 'review',         // Sets the table name to 'review'
  }
);

module.exports = Review;
