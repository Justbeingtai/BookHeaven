const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (name && email && password) {
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // Redirect to profile page on successful sign-up
      document.location.replace('/profile');
    } else {
      const result = await response.json();
      alert(`Failed to sign up: ${result.message}`);
    }
  } else {
    alert('Please fill out all fields.');
  }
};

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);
