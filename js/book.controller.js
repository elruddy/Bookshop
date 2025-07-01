'use-strict';

var filter = {
  title: '',
  minRating: 1,
};

var sortBy = {
  value: '-1',
  ascending: false,
};

function onInit() {
  renderBook();
}

function renderBook() {
  var tableHtml = '';
  var renderedBooks = getBooks();

  renderedBooks = renderedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(filter.title.toLowerCase()) &&
      book.rating >= filter.minRating
  );

  if (sortBy.value !== '-1') {
    renderedBooks.sort((book1, book2) => {
      let returnValue;

      if (typeof book1[sortBy.value] === 'string')
        returnValue = book1[sortBy.value].localeCompare(book2[sortBy.value]);
      else returnValue = book1[sortBy.value] - book2[sortBy.value];

      return sortBy.ascending ? returnValue : returnValue * -1;
    });
  }

  for (var book of renderedBooks) {
    tableHtml =
      tableHtml +
      `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}$</td>
            <td>${book.rating}</td>
            <td>
                <button onclick="onReadBook ('${book.id}')">Read</button> 
                <button onclick="onUpdateBook('${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
    `;
  }

  if (!tableHtml) tableHtml = 'No books found...';
  renderStats();
  insertHtmlByElementId('TableBody', tableHtml);
}

function onRemoveBook(bookId) {
  confirm('Are you sure you want to delet this book?');
  removeBook(bookId);
  renderBook();
  showMsg('You successfully removed the book');
}

function onUpdateBook(bookId) {
  var price = +prompt('What is the new price?');

  if (Number.isNaN(price)) {
    alert('Price must be a number');
    return;
  }

  updateBookPrice(bookId, price);
  renderBook();
  showMsg('You successfully updated the book');
}

function onAddBook() {
  const title = prompt('What is the title of book to be add?');

  if (!title) {
    alert("Title of a book can't be empty");
    return;
  }

  const price = +prompt('What is the price of book to be add?');

  if (Number.isNaN(price)) {
    alert('Price must be a number');
    return;
  }

  const rating = +prompt('How much did you enjoyed book from 1 to 5?');

  if (rating < 1 || rating > 5) {
    alert('Rating must be a number between 1 to 5');
    return;
  }
  addBook(title, price, null, rating);
  renderBook();
  showMsg('You successfully added a book');
}

function onReadBook(bookId) {
  book = getBookbyId(bookId);
  const elBookModal = document.querySelector('.book-details');
  elBookModal.querySelector('h2.title').innerText = book.title;
  elBookModal.querySelector(' h2.price').innerText =
    '$' + book.price.toFixed(2);
  elBookModal.querySelector('p.desc').innerText = book.description;
  elBookModal.querySelector('.rating').innerText = book.rating;
  elBookModal.querySelector('div.book-img img').src = book.imgUrl;
  elBookModal.dataset.bookId = bookId;
  elBookModal.showModal();
}

function changeSortOrder(isAscending) {
  sortBy.ascending = isAscending;

  const ascEelement = document.getElementById('ascend');
  const descEelement = document.getElementById('descend');

  ascEelement.checked = isAscending;
  descEelement.checked = !isAscending;

  renderBook();
}

function onSortSelect(element) {
  sortBy.value = element.value;

  renderBook();
}

function onRatingSelect(element) {
  filter.minRating = +element.value;
  renderBook();
}

function onInputFilter(titleFilterInput) {
  filter.title = titleFilterInput;
  renderBook();
}

function onClear() {
  const elFilter = document.getElementById('inputFilter');
  const elRating = document.getElementById('rating');

  elFilter.value = '';
  elRating.selectedIndex = 0;

  filter = {
    title: '',
    minRating: 1,
  };

  renderBook();
}

function showMsg(msg) {
  const elMsg = document.querySelector('.msg-box');
  elMsg.innerText = msg;
  elMsg.style.display = 'block';

  setTimeout(() => {
    elMsg.style.display = 'none';
  }, 2000);
}
function renderStats() {
  const myStats = getStats();
  const elFooter = document.querySelector('.stats');
  elFooter.querySelector('.expensive-count').innerText = myStats.expensive;
  elFooter.querySelector('.avg-count').innerText = myStats.average;
  elFooter.querySelector('.cheap-count').innerText = myStats.cheap;
}

function onGetBookModal() {
  const elModal = document.querySelector('.bookAddModal');
  console.log(elModal);
  elModal.showModal();
}

function onAddBookByModal(elForm) {
  const formTitle = elForm.querySelector('[name="book-title"]');
  const formPrice = elForm.querySelector('[name="book-price"]');
  const formImgInput = elForm.querySelector('[name="book-img"]');
  const formRating = elForm.querySelector('[name="book-rating"]');

  if (!formTitle.value || !formPrice.value)
    return alert('Please make sure data are filled correctly!');

  addBook(
    formTitle.value,
    +formPrice.value,
    formImgInput?.value,
    +formRating.value
  );
  renderBook();
  showMsg('Congratulations your book repertoire grew');
  elForm.reset();
}

function onCloseBookModal() {
  const elModal = document.querySelector('.bookAddModal');
  elModal.close();
}
