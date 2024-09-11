const router = require('express').Router();
const { Chat, User } = require('../../models');

// Route to get chat history for a room
router.get('/:room', async (req, res) => {
  try {
    const chatData = await Chat.findAll({
      where: { room: req.params.room },           // Fetch chats from the room
      include: { model: User, attributes: ['username'] }, // Include username
    });
    res.status(200).json(chatData);               // Respond with chat data
  } catch (err) {
    res.status(400).json(err);                    // Send error if query fails
  }
});

// Route to get users in a specific room
router.get('/:room/users', async (req, res) => {
  try {
    const onlineUsers = await User.findAll({
      where: { room: req.params.room, online: true }, // Fetch users in room
      attributes: ['username'],                     // Respond with username
    });
    res.status(200).json(onlineUsers);              // Respond with user data
  } catch (err) {
    res.status(400).json(err);                      // Send error if query fails
  }
});

// Route to create a new chat message
router.post('/', async (req, res) => {
  try {
    const { userId, room, message } = req.body;     // Get message details from request body

    // Create the chat message
    const newChat = await Chat.create({ userId, room, message });

    res.status(201).json(newChat);                  // Respond with the created message
  } catch (err) {
    res.status(400).json(err);                      // Send error if create fails
  }
});

module.exports = router;
