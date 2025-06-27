'use-strict';

function onInit() {
  renderBook();
}

function renderBook(filter = '') {
  var tableHtml = '';
  var renderedBooks = getBooks();

  if (filter !== '') {
    renderedBooks = renderedBooks.filter((book) =>
      book.title.toLowerCase().includes(filter.toLowerCase())
    );
  }

  for (var book of renderedBooks) {
    tableHtml =
      tableHtml +
      `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button onclick="onReadBook ('${book.id}')">Read</button> 
                <button onclick="onUpdateBook('${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
    `;
  }

  insertHtmlByElementId('TableBody', tableHtml);
}
function onRemoveBook(bookId) {
  confirm('Are you sure you want to delet this book?');
  removeBook(bookId);
  renderBook();
}

function onUpdateBook(bookId) {
  var price = +prompt('What is the new price?');
  updateBookPrice(bookId, price);
  renderBook();
}

function onAddBook() {
  const title = prompt('What is the title of book to be add?');
  const price = +prompt('What is the price of book to be add?');
  addBook(title, price);
  renderBook();
}

function onReadBook(bookId) {
  book = getBookbyId(bookId);
  const elBookModal = document.querySelector('.book-details');
  elBookModal.querySelector('h2.title').innerText = book.title;
  elBookModal.querySelector(' h2.price').innerText =
    '$' + book.price.toFixed(2);
  elBookModal.querySelector('p.desc').innerText = book.description;
  elBookModal.querySelector('div.book-img img').src = book.imgUrl;
  elBookModal.dataset.bookId = bookId;
  elBookModal.showModal();
}

function onInputFilter(filterBy) {
  renderBook(filterBy);
}

function onClear() {
  const elFilter = document.getElementById('inputFilter');
  elFilter.value = '';
  renderBook();
}
