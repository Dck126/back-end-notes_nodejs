const { addNoteHandler, getAllNoteHandler, getNoteByIdHandler, getNoteEditHandler, getNoteRemoveHandler } = require('./handler');

const routes = [
    {
      method: 'POST',
      path: '/notes',
      handler: addNoteHandler,
    },
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNoteHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNoteByIdHandler,
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: getNoteEditHandler,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: getNoteRemoveHandler,
    },
  

  ];
   
  module.exports = routes;