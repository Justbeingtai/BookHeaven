const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const http = require('http');
const socketio = require('socket.io');
const searchRoutes = require('./controllers/api/searchRoutes');
const genreRoutes = require('./controllers/api/genreRoutes');
const blogRoutes = require('./controllers/api/blogRoutes'); // Register the blog routes
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketio(server); // Initialize Socket.io with the server
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Register the search and genre routes
app.use(searchRoutes);
app.use(genreRoutes); // Register the genre routes

// Register the blog routes
app.use('/blogs', blogRoutes);

// Main routes
app.use(routes);

// Sync the database and start the server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Socket.io logic
io.on('connection', (socket) => {
  const { username } = socket.handshake.auth; // Access the username from the auth payload
  console.log(`New connection from: ${username}`);

  // Notify that a user has connected
  socket.broadcast.emit('message', { username: 'System', message: `${username} has joined the chat!` });

  // Listen for chat messages
  socket.on('chatMessage', (data) => {
    const { message, color } = data;
    console.log(`Message received from ${username}: ${message}`); // Log received messages
    io.emit('message', { username, message, color }); // Emit the message with the username and color
  });

  // Notify when a user disconnects
  socket.on('disconnect', () => {
    io.emit('message', { username: 'System', message: `${username} has left the chat.` });
  });
});
