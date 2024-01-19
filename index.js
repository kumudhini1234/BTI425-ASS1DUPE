/********************************************************************************* 
 * BTI425 – Assignment 1** I declare that this assignment is my own work in accordance with Seneca's
 * * Academic Integrity Policy:** https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html*
 * * Name: Kumudhini Reddicherla Student ID: 174526210 Date: 18th Jan 2024*
 * * Published URL: ___________________________________________________________
 * *********************************************************************************/


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const ListingsDB = require('./modules/listingsDB.js'); 
const db = new ListingsDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Load environmental variables from .env file
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Handle requests to the root path
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Define routes
app.post("/api/listings", (req, res) => {
  res.status(201).json(db.addNewListing(req.body));
});

app.get("/api/listings", (req, res) => {
  db.getAllListings(req.query.page, req.query.perPage, req.query.title)
  .then((listings) => {res.status(200).json(listings)})
  .catch((err) => {res.status(500).json({ error: err })});
});

app.get("/api/listings/:_id", (req, res) => {
  db.getListingById(req.params._id)
  .then((listing)=>{
      res.status(200).json(listing)
  })
  .catch((err)=>{
      res.status(500).json({ error: err })
  });
});

app.put("/api/listings/:_id", (req, res) => {
  db.updateListingById(req.body, req.params._id)
  .then(() => {
      res.status(200).json({ message : 'Success update for _id'});
  })
  .catch((err) => {
      res.status(500).json({ error: err })
  });
});

app.delete("/api/listings/:_id", (req, res) => {
  db.deleteListingById(req.params._id)
  .then(() => {
      res.status(204)
  }).catch(() => {
      res.status(500).json({"message" : "Server Error on Delete"});
  });
});

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// Start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});
