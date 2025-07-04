'use-strict';
const BOOK_KEY = 'bookDatabase';
var gBooks;
_createBooks();

function getBooks() {
  return gBooks;
}

function getBookbyId(bookId) {
  const book = gBooks.find((book) => book.id === bookId);
  return book;
}

function removeBook(bookId) {
  gBooks = gBooks.filter((book) => book.id !== bookId);
  _saveBooks();
}

function updateBookPrice(bookId, newPrice) {
  const book = getBookbyId(bookId);
  book.price = newPrice;

  _saveBooks();
}

function addBook(title, price, img, rating) {
  const newBook = _createBook(title, price, img, rating);
  gBooks.unshift(newBook);
  _saveBooks();
}

function getStats() {
  return gBooks.reduce(
    (returnedObject, book) => {
      if (book.price >= 200) returnedObject.expensive++;
      else if (book.price >= 80) returnedObject.average++;
      else returnedObject.cheap++;

      return returnedObject;
    },
    { expensive: 0, average: 0, cheap: 0 }
  );
}

function _createBook(title, price, imgUrl, rating) {
  return {
    id: makeId(),
    title,
    price,
    imgUrl:
      imgUrl ||
      'https://islandpress.org/sites/default/files/default_book_cover_2015.jpg',
    description: LoremIpsum(30),
    rating,
  };
}

function _createBooks() {
  gBooks = loadFromStorage(BOOK_KEY);
  if (gBooks && gBooks.length > 0) return;
  gBooks = [
    {
      id: makeId(),
      title: 'The Adventures of Tom Sawyer',
      price: 120,
      imgUrl: 'img/tom.jpeg',
      description: LoremIpsum(30),
      rating: getRandomIntInclusive(1, 5),
    },
    {
      id: makeId(),
      title: 'Twilight',
      price: 70,
      imgUrl: 'img/twilight.jpg',
      description: LoremIpsum(30),
      rating: getRandomIntInclusive(1, 5),
    },
    {
      id: makeId(),
      title: 'Gone with Wind',
      price: 100,
      imgUrl: 'img/GonewW.jpeg',
      description: LoremIpsum(30),
      rating: getRandomIntInclusive(1, 5),
    },
  ];
}

function _saveBooks() {
  saveToStorage(BOOK_KEY, gBooks);
}
