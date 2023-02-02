const nano = require('nanoid'); //modul nanoid untuk memberikan nilai unik pada properti id
const notes = require('./notes');

//fungsi untuk menambahkan catatan
const addNoteHandler = (request, h) => {
 const {title, tags, body} = request.payload;


 const id = nano.nanoid(16);
 const createdAt = new Date().toISOString(); //tanggal update
 const updatedAt = createdAt;

 const newNote = { 
    title, tags, body, id, createdAt, updatedAt, //properti dalam newnote yang akan kita isi nantinya 
  };

  notes.push(newNote); //melukakan mtehod push pada properti newnote

  const isSuccess = notes.filter((note) => note.id === id).length > 0; //melakukan fungsi filter pada notes dengan parameter id dimulai dari 0
    //lakukan perkondisian if isSucces == true res berhasil if == false res gagal res(response)
  if (isSuccess) {

    const response = h.response({
        status:'Success',
        message: 'Catatan Berhasil ditambahkan',
        data:{
            noteId:'id'
        },
        
    })    
    response.code(200);
    return response; 
}
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
      
             
};
//fungsi untuk menampilkan catatan
const getAllNoteHandler = () =>({
    status:'Success',
    data:{
     notes,
    },
})

//fungsi untuk mendapatkan detail catatan
const getNoteByIdHandler = (request,h) =>{
    const {id} = request.params;

    const note = notes.filter((n)=> n.id === id)[0];

    if (note !== undefined) {
        return{
            status:'Succes',
            data:{
                note,
            },
        };
    }

    const response = h.response({
        status:'fail',
        message:'catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

// fungsi untuk mengedit cacatan
const getNoteEditHandler = (request,h) => {
    const {id} = request.params;
    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note)=>note.id === id);

    if (index <= 0) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        };

        const response = h.response({
            status:'Success',
            message:'catatan berhasil dibuat',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status:'fail',
        message:'catatn gagal ditambahkan',
    })
    response.code(404);
    return response;
};
const getNoteRemoveHandler = (request,h) => {
    const {id} = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if (index <= 0) {
        notes.splice(index,1);

        const response = h.response({
            status:'Success',
            message:'Catatan Berhasil Dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status:'fail',
        message:'Catatan Gagal Dihapus',
    })
    response.code(404);
    return response;
};
module.exports = { addNoteHandler, getAllNoteHandler, getNoteByIdHandler, getNoteEditHandler, getNoteRemoveHandler };