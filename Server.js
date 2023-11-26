const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

// MongoDB URI and client
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
        throw error;
    }
}

// GET request handler for /customers
app.get('/customers', async (req, res) => {
    try {
        const db = client.db('WM_DB');
        const collection = db.collection('Customer');

        // Using projection to fetch only the CUSTOMERID field
        const projection = { CUSTOMERID: 1, _id: 0 };
        const customers = await collection.find({}, { projection: projection }).toArray();

        res.json(customers);
    } catch (error) {
        res.status(500).send("Error fetching customers: " + error.message);
    }
});


// Start the server and connect to MongoDB
console.log("test");
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await connectToMongoDB();
});
