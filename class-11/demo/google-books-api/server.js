'use strict';

// imports
const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');

// configuration
let app = express();
app.use(cors());
app.set('view engine','ejs');
require('dotenv').config();
const PORT = process.env.PORT;

// endpoints / routes
app.get('/',handleHome);
app.get('/search',handleSearchPage);
app.get('/books',handleBooksSearch);

// 
const baseAPIurl = 'https://www.googleapis.com/books/v1/volumes';


// Handler functions
function handleHome(req,res){
  res.render('pages/index');
}

function handleSearchPage(req,res){
  res.render('pages/newSearch');
}

function handleBooksSearch(req,res){
  // get books data from API
  let searchQuery = req.query.searchquery;
  let searchIn = req.query.searchby;
  let searchQueryConcatenated = searchQuery+'+in'+searchIn;
  let queryParams = {
    q: searchQueryConcatenated
  };
  superAgent.get(baseAPIurl).query(queryParams).then(data =>{
    console.log(data.body);
    res.render('pages/searchResult');
  });
}

app.listen(PORT, ()=>{
  console.log('Server is running on port ', PORT);
});
