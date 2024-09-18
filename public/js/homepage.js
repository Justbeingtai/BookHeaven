let currentPage = 0;
const booksPerPage = 3;

// Fetch and display books
async function loadBooks(page = 0) {
  try {
    const response = await fetch(`/trending-books?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const data = await response.json();

    // Clear the current container
    const container = document.getElementById('trending-books-container');
    container.innerHTML = '';

    // Add new books to the carousel in a single item
    const booksRow = document.createElement('div');
    booksRow.className = `carousel-item ${page === 0 ? 'active' : ''}`;
    booksRow.innerHTML = '<div class="row"></div>';

    // Ensure exactly 3 books are displayed
    data.googleBooks.forEach((book) => {
      const bookCard = `
        <div class="col-md-4">
          <div class="card book-card">
            <img src="${book.volumeInfo.imageLinks?.thumbnail || '/images/default-book.jpg'}" class="card-img-top" alt="${book.volumeInfo.title} cover">
            <div class="card-body">
              <h5 class="card-title">${book.volumeInfo.title}</h5>
              <p class="card-text"><strong>Author:</strong> ${book.volumeInfo.authors || 'Unknown Author'}</p>
              <a href="${book.volumeInfo.infoLink}" class="btn btn-primary" target="_blank">More Info</a>
            </div>
          </div>
        </div>`;
      booksRow.querySelector('.row').innerHTML += bookCard;
    });

    container.appendChild(booksRow);

    // Enable or disable the prev button
    document.getElementById('prev-book-btn').disabled = page === 0;

  } catch (error) {
    console.error('Error loading books:', error);
  }
}

// Event listeners for pagination buttons
document.getElementById('next-book-btn').addEventListener('click', () => {
  currentPage++;
  loadBooks(currentPage);
});

document.getElementById('prev-book-btn').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    loadBooks(currentPage);
  }
});

// Load the initial page
loadBooks();
