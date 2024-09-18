let name = document.querySelector('#username').value || 'Anonymous'; // Fetch the username from the hidden input or set to Anonymous
const socket = io({
  auth: { name }, // Send the name in the auth payload
});

// Grab DOM elements
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#message');
const chatBox = document.querySelector('#message-box');
const colorPicker = document.querySelector('#color-picker');
const currentNameDisplay = document.querySelector('#current-name-display');

// Display the current user's name
if (currentNameDisplay) {
  currentNameDisplay.innerText = `You are chatting as: ${name}`;
}

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
