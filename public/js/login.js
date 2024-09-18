// public/js/login.js
const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (email && password) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Redirect to the profile page after successful login
        document.location.replace('/profile');
      } else {
        alert('Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('An error occurred during login.');
    }
  } else {
    alert('Please fill out both the email and password fields.');
  }
};

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
