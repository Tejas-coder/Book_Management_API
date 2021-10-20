require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Database
// const database = require("./database/database");

//Models
const BookModel = require("./database/books");
const PublicationModel = require("./database/publication");
const AuthorModel = require("./database/author");


const { json } = require("express");


//Initialise expesss
const booky =express();
booky.use(bodyParser.urlencoded({extended: true})); 
booky.use(bodyParser.json()); 

mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>console.log("Connection Established"));


/*
Route           /
Description     Get all the books
Access          PUBLIC
Parameters      NONE
Methods         GET
*/
booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route           /is
Description     Get specific bookmon isbn
Access          PUBLIC
Parameters      ISBN
Methods         GET
*/
booky.get("/is/:isbn", async (req,res) => {
    const getBook = await BookModel.findOne({ISBN: req.params.isbn});
    if (!getBook) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }
    else
    {
        return res.json(getBook);
    }
});

/*
Route           /c
Description     Get a list of books based on category
Access          PUBLIC
Parameters      category
Methods         GET
*/
booky.get("/c/:category", async (req,res) => {
    const getBookbyCategory = await BookModel.findOne({category: req.params.category});
    if (!getBookbyCategory) {
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }
    else
    {
        return res.json({Book: getBookbyCategory});
    }
});

/*
Route           /l
Description     Get a list of books based on category
Access          PUBLIC
Parameters      language
Methods         GET
*/
booky.get("/l/:language", (req,res) => {
    const getBookbyLanguage = database.books.filter(
        (book) => book.language.includes(req.params.language)
    );
    if (getBookbyLanguage.length === 0) {
        return res.json({error: `No book found for the Language of ${req.params.language}`});
    }
    else
    {
        return res.json({Book: getBookbyLanguage});
    }
});

/*
Route           /author
Description     Get all the authors
Access          PUBLIC
Parameters      NONE
Methods         GET
*/
booky.get("/author", async (req,res) => {
    const getAllAuthor = await AuthorModel.find();
    return res.json(getAllAuthor);
});

/*
Route           /author
Description     Get all the authors
Access          PUBLIC
Parameters      NONE
Methods         GET
*/
booky.get("/author/name/:id", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
    );
    if (getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for the book of ${req.params.isbn}`});
    }
    else
    {
        return res.json({Book: getSpecificAuthor});
    }
});

/*
Route           /author/book
Description     Get all the authors
Access          PUBLIC
Parameters      ISBN
Methods         GET
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if (getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for the book of ${req.params.isbn}`});
    }
    else
    {
        return res.json({Book: getSpecificAuthor});
    }
});

/*
Route           /publication
Description     Get all the Publications
Access          PUBLIC
Parameters      NONE
Methods         GET
*/
booky.get("/publication", async (req,res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
});

/*
Route           /publication
Description     Get specific the Publications by ID
Access          PUBLIC
Parameters      ID
Methods         GET
*/
booky.get("/publication/:id", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === parseInt(req.params.id)
    );
    if (getSpecificPublication.length === 0)
    {
        return res.json({error: `No Publication found for id: ${req.params.id}`});
    }
    else
    {
        return res.json({publication: getSpecificPublication});
    }
});

/*
Route           /publication/name
Description     Get specific the Publications by Books
Access          PUBLIC
Parameters      Book
Methods         GET
*/
booky.get("/publication/name/:book", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.book)
    );
    if (getSpecificPublication.length === 0)
    {
        return res.json({error: `No Publication found for book: ${req.params.book}`});
    }
    else
    {
        return res.json({publication: getSpecificPublication});
    }
});




//POST
/*
Route           /book/new
Description     Add new book
Access          PUBLIC
Parameters      NONE
Methods         Post
*/
booky.post("/book/new",async (req,res) => {
    const newBook = req.body;
    BookModel.create(newBook);
    return res.json({
    message: "Book was added !!!"
    });
    // const oldBook = database.books.filter(
    //     (book) => book.ISBN === newBook.ISBN
    // );
    // if (oldBook.length === 0) {
    //     database.books.push(newBook);
    //     return res.json({updatedBooks: database.books});
    // }
    // else {
    //     return res.json({error: `Book Already exsist`});
    // }
});

/*
Route           /author/new
Description     Add new Author
Access          PUBLIC
Parameters      NONE
Methods         Post
*/
booky.post("/author/new", (req,res) => {
    const newAuthor = req.body;
    AuthorModel.create(newAuthor);
    return res.json({Author: addNewAuthor});
});

/*
Route           /publication/new
Description     Add new Publication
Access          PUBLIC
Parameters      NONE
Methods         Post
*/
booky.post("/publication/new", (req,res) => {
    const newPublication = req.body;
    PublicationModel.create(newPublication);
    return res.json({message: "Publication Added Successfully"});
});




//PUT
/*
  Route            /book/author/
  Description      Update /add new book
  Access           PUBLIC
  Parameter        isbn
  Methods          PUT
  */
booky.put("/book/update/:isbn",async (req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn
      },
      {
        title: req.body.bookTitle
      },
      {
        new: true
      }
    );
  
    return res.json({
      books: updatedBook
    });
  });
  
  /*********Updating new author**********/
  /*
  Route            /book/author/update
  Description      Update /add new author
  Access           PUBLIC
  Parameter        isbn
  Methods          PUT
  */
  
  booky.put("/book/author/update/:isbn", async(req,res) =>{
    //Update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.body.newAuthor
      }
    },
    {
      new: true
    }
  );
  
    //Update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: req.body.newAuthor
      },
      {
        $addToSet: {
          books: req.params.isbn
        }
      },
      {
        new: true
      }
    );
  
    return res.json(
      {
        bookss: updatedBook,
        authors: updatedAuthor,
        message: "New author was added"
      }
    );
  } );
  
  
  
  
  
  
  
  
  
  /*
  Route            /publication/update/book
  Description      Update /add new publication
  Access           PUBLIC
  Parameter        isbn
  Methods          PUT
  */
  
  booky.put("/publication/update/book/:isbn", (req,res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
      if(pub.id === req.body.pubId) {
        return pub.books.push(req.params.isbn);
      }
    });
  
    //Update the book database
    database.books.forEach((book) => {
      if(book.ISBN === req.params.isbn) {
        book.publications = req.body.pubId;
        return;
      }
    });
  
    return res.json(
      {
        books: database.books,
        publications: database.publication,
        message: "Successfully updated publications"
      }
    );
  });


  
/****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete(
      {
        ISBN: req.params.isbn
      }
    );
  
    return res.json({
      books: updatedBookDatabase
    });
  });


  /*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
     database.books.forEach((book)=>{
       if(book.ISBN === req.params.isbn) {
         const newAuthorList = book.author.filter(
           (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
         );
         book.author = newAuthorList;
         return;
       }
     });
  
  
    //Update the author database
    database.author.forEach((eachAuthor) => {
      if(eachAuthor.id === parseInt(req.params.authorId)) {
        const newBookList = eachAuthor.books.filter(
          (book) => book !== req.params.isbn
        );
        eachAuthor.books = newBookList;
        return;
      }
    });
  
    return res.json({
      book: database.books,
      author: database.author,
      message: "Author was deleted!!!!"
    });
  });






booky.listen(3000 , () => {
    console.log("Server on port 3000")
});