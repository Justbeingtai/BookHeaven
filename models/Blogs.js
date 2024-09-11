// models/Blogs.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Blogs extends Model {}

Blogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Title is required
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // Blog content is required
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user', // Reference the user model (author of the blog)
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true, // Enable createdAt and updatedAt timestamps
    freezeTableName: true,
    underscored: true,
    modelName: 'blogs',
  }
);

module.exports = Blogs;
