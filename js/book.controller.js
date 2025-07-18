'use-strict';

var gQueryOptions = {
  filter: { title: '', minRating: 1 },
  sortBy: { value: '-1', ascending: false },
  layout: 'table',
  page: { idx: 1, size: 3 },
};

var editedBookId = null;

function onInit() {
  readQueryParams();
  setQueryParams();
  renderBooks();
  renderStats();
}

function renderBooks() {
  var books = getBooks(gQueryOptions.filter, gQueryOptions.page);
  var renderedBooks = books.books;

  if (gQueryOptions.sortBy.value !== '-1') {
    renderedBooks.sort((book1, book2) => {
      let returnValue;

      if (typeof book1[gQueryOptions.sortBy.value] === 'string')
        returnValue = book1[gQueryOptions.sortBy.value].localeCompare(
          book2[gQueryOptions.sortBy.value]
        );
      else
        returnValue =
          book1[gQueryOptions.sortBy.value] - book2[gQueryOptions.sortBy.value];

      return gQueryOptions.sortBy.ascending ? returnValue : returnValue * -1;
    });
  }

  if (gQueryOptions.layout === 'table') renderBooksTable(renderedBooks);
  else renderBooksCards(renderedBooks);

  renderPagination(books.totalPages);
}

function renderPagination(totalPages) {
  var innerHtml = `<div class="page-btn" onclick="prevPage(${totalPages})">Prev</div>`;

  for (var i = 1; i <= totalPages; i++) {
    innerHtml =
      innerHtml +
      `<div id="page-${i}" class="page-number" onclick="changePageTo(${i})">${i}</div>`;
  }

  innerHtml =
    innerHtml +
    `<div class="page-btn" onclick="nextPage(${totalPages})">Next</div>`;

  const container = document.getElementById('pages');
  container.innerHTML = innerHtml;
}

function renderBooksCards(renderedBooks) {
  if (!renderedBooks.length) {
    document.getElementById('CardsBody').innerText = 'No books found...';
    return;
  }

  var cardsArr = renderedBooks.map(
    (book) =>
      `<div class="book-card">
            <img src="${book.imgUrl}" />
            <p><strong>Title:</strong> ${book.title}</p>
            <p><strong>Description:</strong> ${book.description}</p>
            <div class="actions">
                <button class="material-symbols-outlined" onclick="onReadBook('${book.id}')" >book_5</button>
                <button  class="material-symbols-outlined" onclick="onAddOrEditBookModal(null, '${book.id}')" >update</button>
                <button  class="material-symbols-outlined" onclick="onRemoveBook('${book.id}')" >delete</button>
            </div>
        </div>`
  );
  const insertHtml = cardsArr.join('');

  const ele = document.querySelector('.cards-container');
  ele.style.display = 'flex';
  const eleTable = document.querySelector('.table-container');
  eleTable.style.display = 'none';
  insertHtmlByElementId('CardsBody', insertHtml);
}

function renderBooksTable(renderedBooks) {
  if (!renderedBooks.length) {
    document.getElementById('TableBody').innerText = 'No books found...';
    return;
  }

  var insertHtml = '';

  for (var book of renderedBooks) {
    insertHtml =
      insertHtml +
      `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}$</td>
            <td>${book.rating}</td>
            <td>
                <button onclick="onReadBook ('${book.id}')">Read</button> 
                <button onclick="onAddOrEditBookModal(null, '${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
    `;
  }

  const eleTable = document.querySelector('.table-container');
  eleTable.style.display = 'table';
  const ele = document.querySelector('.cards-container');
  ele.style.display = 'none';
  insertHtmlByElementId('TableBody', insertHtml);
}

function onRemoveBook(bookId) {
  confirm('Are you sure you want to delet this book?');
  removeBook(bookId);
  renderBooks();
  showMsg('You successfully removed the book');
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
  renderBooks();
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
  gQueryOptions.sortBy.ascending = isAscending;
  setQueryParams();

  const ascEelement = document.getElementById('ascend');
  const descEelement = document.getElementById('descend');

  ascEelement.checked = isAscending;
  descEelement.checked = !isAscending;

  renderBooks();
}

function onSortSelect(element) {
  gQueryOptions.sortBy.value = element.value;
  setQueryParams();
  renderBooks();
}

function onRatingSelect(element) {
  gQueryOptions.filter.minRating = +element.value;
  setQueryParams();
  renderBooks();
}

function onInputFilter(titleFilterInput) {
  gQueryOptions.filter.title = titleFilterInput;
  setQueryParams();
  renderBooks();
}

function nextPage(totalPages) {
  if (gQueryOptions.page.idx === totalPages) gQueryOptions.page.idx = 0;

  gQueryOptions.page.idx++;

  setQueryParams();
  renderBooks();
}

function prevPage(totalPages) {
  if (gQueryOptions.page.idx === 1) gQueryOptions.page.idx = totalPages + 1;

  gQueryOptions.page.idx--;

  setQueryParams();
  renderBooks();
}

function changePageTo(idx) {
  gQueryOptions.page.idx = idx;

  setQueryParams();
  renderBooks();
}

function onClear() {
  const elFilter = document.getElementById('inputFilter');
  const elRating = document.getElementById('rating');

  elFilter.value = '';
  elRating.selectedIndex = 0;

  gQueryOptions.filter = {
    title: '',
    minRating: 1,
  };

  setQueryParams();
  renderBooks();
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

function onAddOrEditBookModal(action, bookId) {
  const elModal = document.querySelector('.bookModal');
  var h3Text = 'Add a book';

  const h3header = document.getElementById('modal-header');
  const elButton = document.getElementById('modalButton');
  elModal.showModal();

  if (action !== 'add') {
    h3Text = 'Edit a book';

    editedBookId = bookId;
    const book = getBookbyId(editedBookId);

    const elForm = document.getElementById('addOrEditBook');
    const formTitle = elForm.querySelector('[name="book-title"]');
    const formPrice = elForm.querySelector('[name="book-price"]');
    const formImgInput = elForm.querySelector('[name="book-image"]');
    const formRating = elForm.querySelector('[name="book-rating"]');

    formTitle.value = book.title;
    formPrice.value = book.price;
    formImgInput.value = book.imgUrl;
    formRating.value = book.rating;
  }

  h3header.innerText = h3Text;
  elButton.innerText = h3Text;
}

function onBookModalSubmit(elForm) {
  const formTitle = elForm.querySelector('[name="book-title"]');
  const formPrice = elForm.querySelector('[name="book-price"]');
  const formImgInput = elForm.querySelector('[name="book-image"]');
  const formRating = elForm.querySelector('[name="book-rating"]');

  if (!formTitle.value || !formPrice.value)
    return alert('Please make sure data are filled correctly!');

  if (editedBookId) {
    updateBook(
      editedBookId,
      formTitle.value,
      formImgInput?.value,
      +formPrice.value,
      +formRating.value
    );
  } else {
    addBook(
      formTitle.value,
      +formPrice.value,
      formImgInput?.value,
      +formRating.value
    );
  }
  renderBooks();
  showMsg(
    editedBookId
      ? 'Edited book sucesfully'
      : 'Congratulations your book repertoire grew'
  );

  editedBookId = null;
  elForm.reset();
}

function onCloseBookModal() {
  const elModal = document.querySelector('.bookModal');
  editedBookId = null;
  elModal.close();
}

function readQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);

  gQueryOptions.filter = {
    title: queryParams.get('title') || '',
    minRating: +queryParams.get('minRating') || 1,
  };

  gQueryOptions.sortBy = {
    value: queryParams.get('sortValue') || '-1',
    ascending: queryParams.get('sortAsc') === 'true',
  };

  gQueryOptions.layout = queryParams.get('layout') || 'table';

  renderQueryParams();
}

function renderQueryParams() {
  document.getElementById('inputFilter').value = gQueryOptions.filter.title;
  document.getElementById('rating').value = gQueryOptions.filter.minRating;
  document.getElementById('ascend').checked = gQueryOptions.sortBy.ascending;
  document.getElementById('descend').checked = !gQueryOptions.sortBy.ascending;
  document.getElementById('sort').value = gQueryOptions.sortBy.value;
}

function setQueryParams() {
  const queryParams = new URLSearchParams();

  if (gQueryOptions.filter.title)
    queryParams.set('title', gQueryOptions.filter.title);

  queryParams.set('minRating', gQueryOptions.filter.minRating);

  if (gQueryOptions.sortBy.value !== '-1') {
    queryParams.set('sortValue', gQueryOptions.sortBy.value);
  }

  queryParams.set('layout', gQueryOptions.layout);

  queryParams.set('sortAsc', gQueryOptions.sortBy.ascending);

  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    '?' +
    queryParams.toString();

  window.history.pushState({ path: newUrl }, '', newUrl);
}

function onSetLayout(txt) {
  gQueryOptions.layout = txt;
  setQueryParams();
  renderBooks();
}
