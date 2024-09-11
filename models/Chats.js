const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Chat extends Model {}

// Define the schema for the Chat model
Chat.init(
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
    room: {
      type: DataTypes.STRING(255),
      allowNull: false,       // Ensures room name is always set
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,       // Ensures message is always required
    },
  },
  {
    sequelize,
    timestamps: true,         // Tracks when messages are created and updated
    freezeTableName: true,    // Prevents table name from being pluralized
    underscored: true,        // Uses snake_case column names
    modelName: 'chat',        // Sets the table name to 'chat'
  }
);

module.exports = Chat;
