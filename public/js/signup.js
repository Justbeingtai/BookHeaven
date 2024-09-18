const signupFormHandler = async (event) => {
  event.preventDefault();

  // Get the values from the form
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  // Ensure all fields are filled out
  if (name && email && password) {
    try {
      // Send the POST request to the API
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }), // Ensure this is correct
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Redirect to the profile page or homepage after successful sign-up
        document.location.replace('/profile');
      } else {
        const errorMessage = await response.json();
        alert(`Failed to sign up: ${errorMessage.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during sign-up.');
    }
  } else {
    alert('Please fill out all fields.');
  }
};

// Attach the handler to the form
document
  .querySelector('#signup-form')
  .addEventListener('submit', signupFormHandler);
