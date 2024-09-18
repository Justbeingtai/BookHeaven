let name = 'Anonymous'; // Default name
const socket = io({
  auth: { name }, // Send the name in the auth payload
});

// Grab DOM elements
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#message');
const chatBox = document.querySelector('#message-box');
const colorPicker = document.querySelector('#color-picker');
const nameInput = document.querySelector('#name-input');
const changeNameButton = document.querySelector('#change-name');
const currentNameDisplay = document.querySelector('#current-name');

// Handle message submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = chatInput.value;
  const color = colorPicker.value;

  if (message) {
    // Send the message and color to the server
    socket.emit('chatMessage', { message, color, name });

    // Clear the input field after sending
    chatInput.value = '';
    chatInput.focus();
  }
});

// Listen for messages from the server
socket.on('message', (data) => {
  const newMessage = document.createElement('div');
  newMessage.classList.add('message');
  newMessage.style.color = data.color; // Set the message color
  newMessage.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
});
