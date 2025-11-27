const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if(!isValid(username)){
    if(username && password){
        users.push({
            "username": username,
            "password": password
        })
        res.status(200).send("Account registered!")
    } else {
      res.send("Please insert both username and password.")
    }
  } else {
    res.send("Username already exists.")
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(books[isbn]){
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let bookByAuthor = Object.values(books).filter((book) => book.author === req.params.author)
    res.send(JSON.stringify(bookByAuthor, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let bookByTitle = Object.values(books).filter((book) => book.title === req.params.title)
    res.send(JSON.stringify(bookByTitle, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(books[isbn]){
      res.send(JSON.stringify(books[isbn], ["reviews"], 4));
    } else {
      res.send("Book not found");
    }
});

module.exports.general = public_users;
