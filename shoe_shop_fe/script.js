const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', () => {
  searchInput.classList.toggle('show');
  if (searchInput.classList.contains('show')) {
    searchInput.focus();
  }
});
