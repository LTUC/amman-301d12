'use strict';

// import packages
const express = require('express');
const superAgent = require('superagent');
const cors = require('cors');
const pg = require('pg');

// initializations and configurations
const app = express();
app.use(cors());
require('dotenv').config();
const client = new pg.Client(process.env.DATABASE_URL);


//
const PORT = process.env.PORT;

// routes
app.get('/',handleHome);

// handlers
function handleHome(req,res){
  let city = req.query.city;


  const query = {
    key: process.env.GEOCODE_API_KEY,
    q: city,
    limit: 1,
    format: 'json'
  };
  let url = 'https://us1.locationiq.com/v1/search.php';

  superAgent.get(url).query(query).then(data => {
    let lon = data.body[0].lon;
    let lat = data.body[0].lat;

    let dbQuery = `INSERT INTO cities(city_name, lon,lat) VALUES ($1,$2,$3)RETURNING *`;
    let safeValues = [city,lon,lat];

    client.query(dbQuery,safeValues).then(data=>{
      console.log('data returned back from db ',data.rows);
    }).catch(error=>{
      console.log('an error occurred '+error);
    });

    res.status(200).send('the latitude value is ' + lat + ' and the longitude is '+lon);
  }).catch(error =>{
    res.status(500).send('something went wrong '+error);
  });

}





client.connect().then(()=>{
  app.listen(PORT, ()=>{
    console.log('the app is listening to port '+ PORT);
  });
}).catch(error =>{
  console.log('an error occurred while connecting to database '+error);
});
