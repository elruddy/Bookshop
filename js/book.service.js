'use-strict';

var gBooks = [
  {
    id: 'bg4J78',
    title: 'The adventures of Lori Ipsi',
    price: 120,
    imgUrl: 'lori-ipsi.jpg',
  },
  {
    id: 'bg4J79',
    title: 'Twilight',
    price: 70,
    imgUrl: 'twilight.jpg',
  },
  {
    id: 'bg4J80',
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
