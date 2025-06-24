'use-strict';
function onInit() {
  render();
}

function render() {
  var tableHtml = '';
  var books = getBooks();

  for (var book of books) {
    tableHtml =
      tableHtml +
      `
        <tr>
            <th>${book.title}</th>
            <th>${book.price}</th>
            <th>
                <button>Read</button> 
                <button>Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </th>
        </tr>
    `;
  }

  insertHtmlByElementId('TableBody', tableHtml);
}
function onRemoveBook(bookId) {
  removeBook(bookId);
  render();
}
