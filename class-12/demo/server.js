'use strict';

// import statements
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// configuration
require('dotenv').config();
let app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
let client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;

// routes - endpoints
app.get('/addTask', renderForm);
app.post('/addTask', addTaskToDB);
app.get('/', renderHome);
app.get('/tasks/:id',renderTask);

// -----
function renderForm(req, res) {
  res.render('taskform');
}

function addTaskToDB(req, res) {
  console.log(req.body);
  let insertQuery = 'INSERT INTO tasks(title,description,contact,status,category) VALUES($1, $2, $3, $4, $5)';
  let reqBody = req.body;
  let safeValues = [reqBody.title, reqBody.description, reqBody.contact, reqBody.status, reqBody.category];

  client.query(insertQuery, safeValues).then(() => {
    res.redirect('/');
  }).catch(error => {
    console.log('An error occurred while inserting task into database ', error);
  });
}

function renderHome(req, res) {
  let selectQuery = 'SELECT * FROM tasks;';
  client.query(selectQuery).then(data => {
    res.render('index', { tasks: data.rows });
  }).catch(error => {
    console.log('An error occurred while retrieving tasks from DB ', error);
  });
}

function renderTask(req,res){
  let id = req.params.id;
  let selectQuery = 'SELECT * FROM tasks WHERE id=$1';
  let safeValues = [id];

  client.query(selectQuery,safeValues).then(data =>{
    res.render('taskdetails', {task : data.rows[0]});
  }).catch(error =>{
    console.log(`an error occurred while getting task with ID number ${id} from DB ${error}`);
  });

}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log('listening on port ', PORT);
  });
}).catch((error) => {
  console.log('Sorry! an error occurred while connecting to the DB ', error);
});


