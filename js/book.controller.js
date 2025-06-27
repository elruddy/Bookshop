'use-strict';

function onInit() {
  renderBook();
}

function renderBook() {
  var tableHtml = '';
  var books = getBooks();

  for (var book of books) {
    tableHtml =
      tableHtml +
      `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button>Read</button> 
                <button onclick="onUpdateBook('${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
    `;
  }

  insertHtmlByElementId('TableBody', tableHtml);
}
function onRemoveBook(bookId) {
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
