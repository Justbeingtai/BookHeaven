const newBlogFormHandler = async (event) => {
  console.log('newBlogFormHandler: ', newBlogFormHandler);
  event.preventDefault();

  const title = document.querySelector('#blog-title').value.trim();
  const rating = document.querySelector('#blog-rating').value.trim();
  const content = document.querySelector('#blog-content').value.trim();
  const userId = document.querySelector('#hidden-user').value.trim();
  console.log('title: ', title);
  console.log('rating: ', rating);
  console.log('content: ', content);
  console.log('user: ', userId);
  if (title && rating && content && userId) {
    const response = await fetch(`/api/blogs`, {
      method: 'POST',
      body: JSON.stringify({ title, rating, userId, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace('/profile');
    } else {
      // alert('Failed to create project');
      document.querySelector('.blog-group .alert').classList.remove('hide');
    }
  }
};

const newBookFormHandler = async (event) => {
  console.log('newBlogFormHandler: ', newBlogFormHandler);
  event.preventDefault();

  const title = document.querySelector('#book-title').value.trim();
  const author = document.querySelector('#book-author').value.trim();
  const genre = document.querySelector('#book-genre').value.trim();
  const description = document.querySelector('#book-description').value.trim();
  console.log('title: ', title);
  console.log('author: ', author);
  console.log('genre: ', genre);
  console.log('description: ', description);
  if (title && author && genre && description) {
    const response = await fetch(`/api/books`, {
      method: 'POST',
      body: JSON.stringify({ title, author, genre, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace('/profile');
    } else {
      document.querySelector('.books-group .alert').classList.remove('hide');
    }
  }
};

const deleteBlogButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      document.querySelector('.blog-group .alert').classList.remove('hide');

      document.querySelector('.blog-group .alert').innerHTML =
        'Failed to delete blog!';
    }
  }
};

const deleteBookButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      document.querySelector('.books-group .alert').classList.remove('hide');

      document.querySelector('.books-group .alert').innerHTML =
        'Failed to delete book!';
    }
  }
};

document
  .querySelector('#new-blog-form')
  .addEventListener('submit', newBlogFormHandler);

document
  .querySelector('#new-book-form')
  .addEventListener('submit', newBookFormHandler);

document
  .querySelectorAll('.blogs .btn')
  .forEach((i) => i.addEventListener('click', deleteBlogButtonHandler));

document
  .querySelectorAll('.books .btn')
  .forEach((i) => i.addEventListener('click', deleteBookButtonHandler));
