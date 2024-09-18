const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const http = require('http');
const socketio = require('socket.io');
const searchRoutes = require('./controllers/api/searchRoutes'); // Search routes
const genreRoutes = require('./controllers/api/genreRoutes');  // Genre routes
const blogRoutes = require('./controllers/api/blogRoutes');    // Blog routes
const homeRoutes = require('./controllers/homeRoutes');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketio(server); // Initialize Socket.io with the server
const PORT = process.env.PORT || 3001;

// Set up session with Sequelize store
const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000, // 5 minutes session expiration
    httpOnly: true, // Helps prevent cross-site scripting (XSS)
    secure: false,  // Set to true in production (with HTTPS)
    sameSite: 'strict', // Restricts cookies to the same site
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize, // Connect Sequelize store with the current database
  }),
};

// Use session middleware
app.use(session(sess));

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware to parse JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes); 

// Register the search and genre routes
app.use('/search', searchRoutes); // Use /search as a base path for search routes
app.use('/genre', genreRoutes);   // Use /genre as a base path for genre routes


// Register the blog routes
app.use('/blogs', blogRoutes);    // Use /blogs as a base path for blog routes

// Register main routes (other controllers)
app.use(routes);  // The main app routes are registered here

// Sync the database and start the server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Socket.io logic for real-time chat
io.on('connection', (socket) => {
  const { name } = socket.handshake.auth || { name: 'Anonymous' }; // Default to 'Anonymous' if no name provided
  console.log(`New connection from: ${name}`);

  // Listen for chat messages
  socket.on('chatMessage', (data) => {
    const { message, color } = data;
    const time = new Date().toLocaleTimeString(); // Add timestamp for messages

    // Broadcast the message to everyone
    io.emit('message', { name, message, color, time });
  });

  // Notify when a user disconnects
  socket.on('disconnect', () => {
    io.emit('message', { name: 'System', message: `${name} has left the chat.`, color: '#FF0000' });
  });
});
