const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let foundUser = users.filter((user) => user.username === username)
    if(foundUser.length > 0){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let foundUser = users.filter((user) => user.username === username && user.password === password);
    return foundUser.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if(username && password){
    if(authenticatedUser){
        let accessToken = jwt.sign({
            token: password
        }, 'access', {expiresIn: 60* 60})

        req.session.authentication = {
            accessToken, username
        }
        res.send("User logged in")
        return res.status(200).send("User logged in!")
    } else {
        return res.status(208).send({message: "invalid username/password"})
    }
  } else {
    return res.status(404).send({message: "missing username or password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    if(books[isbn]){
        let reviews = books[isbn].reviews
        let foundReview = reviews.filter((user) => user.username === req.user)
        if(foundReview.length > 0){
            foundReview.review = req.query.review
            res.send("Review Updated")
        } else {
            reviews.push({
                "username": req.user,
                "review": req.query.review
            })
            res.send("Review Created")
        }
        return res.status(200)
    } else {
      res.send("Book not found");
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
