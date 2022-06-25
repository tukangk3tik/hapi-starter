const { nanoid } = require('nanoid');
const books = require('./entity/books');

// function for all response error
function responseError(h, msg, code = 400) {
  const response = h.response({
    status: 'fail',
    message: msg,
  });
  response.code(code);
  return response;
}

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) return responseError(h, 'Gagal menambahkan buku. Mohon isi nama buku');
  if (pageCount < readPage) return responseError(h, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    finished,
    readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (!isSuccess) responseError(h, 'Gagal menambahkan buku', 500);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;
  let formatBooks = books;

  if (name !== undefined) {
    // search by name
    formatBooks = books.filter((book) => (book.name.toLowerCase().includes(name.toLowerCase())));
  } else if (reading !== undefined) {
    // search by is read
    const isReading = (reading === '1');
    formatBooks = books.filter((book) => book.reading === isReading);
  } else if (finished !== undefined) {
    // search by is finish
    const isFinished = (finished === '1');
    formatBooks = books.filter((book) => book.finished === isFinished);
  }

  const result = formatBooks.map((book) => (
    { id: book.id, name: book.name, publisher: book.publisher }
  ));

  return {
    status: 'success',
    data: {
      books: result,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];
  if (book === undefined) return responseError(h, 'Buku tidak ditemukan', 404);

  return {
    status: 'success',
    data: {
      book,
    },
  };
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return responseError(h, 'Gagal memperbarui buku. Id tidak ditemukan', 404);

  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) return responseError(h, 'Gagal memperbarui buku. Mohon isi nama buku');
  if (pageCount < readPage) return responseError(h, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    finished,
    readPage,
    reading,
    updatedAt,
  };

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return responseError(h, 'Buku gagal dihapus. Id tidak ditemukan', 404);

  books.splice(index, 1);
  return {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
