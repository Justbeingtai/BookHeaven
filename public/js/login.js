const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile'); // Redirect to the profile page after successful login
    } else {
      alert('Failed to log in. Please check your credentials and try again.');
    }
  }
};

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
