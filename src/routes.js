const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const booksPath = '/books';

const routes = [
  {
    method: 'POST',
    path: booksPath,
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: booksPath,
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: `${booksPath}/{id}`,
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: `${booksPath}/{id}`,
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: `${booksPath}/{id}`,
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
