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
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
    books: addNewBook,
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
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({Author: newAuthor});
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
    database.publication.push(newPublication);
    return res.json({updatedPublication: database.publication});
});




//PUT
/*
Route           /publication/new
Description     Add new Publication
Access          PUBLIC
Parameters      NONE
Methods         Post
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
        book.publication = req.body.pubId;
        return;
        }
    });
    
    return res.json({
        books: database.books,
        publications: database.publication,
        message: "Successfully updated publications"
    });
});



//-------------DELETE------
/*
Route           /book/delete
Description     Delete Book
Access          PUBLIC
Parameters      ISBN
Methods         DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
    const updatedBookdatabase = database.books.filter (
        (book) => book.ISBN != req.params.isbn
    );
    database.books = updatedBookdatabase;
    return res.json({book: database.books});
});

/*
Route           /book/delete/author
Description     Delete author and book related to it
Access          PUBLIC
Parameters      ISBN, authorId
Methods         DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Upadte the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor != parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    //Update the author database
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter(
                (eachbook) => eachbook !== req.params.isbn
            );
            author.books = newBookList;
            return
        }
    });
    return res.json({
        book: database.books,
        author: database.author,
        message: "Updated Successfully"
    });
});

/*
Route           /book/author/detele
Description     Delete author from book
Access          PUBLIC
Parameters      ISBN, authorId
Methods         DELETE
*/
booky.delete("/book/author/delete/:isbn/:authorId", (req,res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return
        }
    });
    return res.json({book: database.books});
});






booky.listen(3000 , () => {
    console.log("Server on port 3000")
});