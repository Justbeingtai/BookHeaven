const username = document.querySelector('#username')?.textContent || 'Anonymous'; // Fetch the username or default to 'Anonymous'
const socket = io({
  auth: { username }, // Send the username in the auth payload
});

// Grab DOM elements
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#message');
const chatBox = document.querySelector('#message-box');
const colorPicker = document.querySelector('#color-picker');

// Handle message submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = chatInput.value;
  const color = colorPicker.value;

  if (message) {
    console.log(`Sending message: ${message} with color ${color}`); // Log the message being sent
    // Send the message and color to the server
    socket.emit('chatMessage', { message, color });

    // Clear the input field after sending
    chatInput.value = '';
    chatInput.focus();
  }
});

// Listen for messages from the server
socket.on('message', (data) => {
  console.log(`Message from server: ${data.username}: ${data.message}`); // Log received messages
  const newMessage = document.createElement('div');
  newMessage.classList.add('message');
  newMessage.style.color = data.color; // Set the message color
  newMessage.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
});
