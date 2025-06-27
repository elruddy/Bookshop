'use-strict';

var gBooks = [
  {
    id: makeId(),
    title: 'The adventures of Lori Ipsi',
    price: 120,
    imgUrl: 'lori-ipsi.jpg',
  },
  {
    id: makeId(),
    title: 'Twilight',
    price: 70,
    imgUrl: 'twilight.jpg',
  },
  {
    id: makeId(),
    title: 'Gone with Wind',
    price: 100,
    imgUrl: 'GonewW.jpg',
  },
];

function getBooks() {
  return gBooks;
}

function removeBook(bookId) {
  gBooks = gBooks.filter((book) => book.id !== bookId);
}

function updateBookPrice(bookId, newPrice) {
  book = gBooks.find((book) => book.id === bookId);
  book.price = newPrice;
}

function addBook(title, price) {
  const newBook = _createBook(title, price);
  gBooks.unshift(newBook);
}

function _createBook(title, price, imgUrl) {
  return {
    id: makeId(),
    title,
    price,
    imgUrl:
      imgUrl ||
      'https://islandpress.org/sites/default/files/default_book_cover_2015.jpg',
  };
}
