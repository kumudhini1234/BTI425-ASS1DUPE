/********************************************************************************* 
 * BTI425 – Assignment 1** I declare that this assignment is my own work in accordance with Seneca's
 * * Academic Integrity Policy:** https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html*
 * * Name: Kumudhini Reddicherla Student ID: 174526210 Date: 18th Jan 2024*
 * * Published URL: ___________________________________________________________
 * *********************************************************************************/


const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();

const ListingsDB = require("./modules/listingsDB");
const db = new ListingsDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send({messages: "API Listening"});
});

app.get("/api/listings/:id", async (req,res)=>{
    let listing = await db.getListingById(req.params.id);
    if(listing){
        res.send(listing);
    }else{
        res.status(404).send({messages: 'no listings found'});
    }
});



app.post("/api/listings", async (req, res) => {
    try {
        const newListing = req.body;
        const result = await db.addNewListing(newListing);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.get("/api/listings", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const name = req.query.name || null;

        const listings = await db.getAllListing(page, perPage, name);
        res.status(200).send(listings);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.get("/api/listings/:id", async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (listing) {
            res.status(200).send(listing);
        } else {
            res.status(404).send({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.put("/api/listings/:id", async (req, res) => {
    try {
        const updatedListing = req.body;
        const result = await db.updateListingById(updatedListing, req.params.id);
        if (result) {
            res.status(200).send({ message: 'Listing updated successfully' });
        } else {
            res.status(404).send({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.delete("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.deleteListingById(req.params.id);
        if (result) {
            res.status(200).send({ message: 'Listing deleted successfully' });
        } else {
            res.status(404).send({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{console.log(err);
});

