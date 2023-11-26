const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config(); // Load environment variables

const uri = "mongodb+srv://v55star:8587953116@cluster0.ubgyypf.mongodb.net/?retryWrites=true&w=majority"; 

let client;
let db;

const connectToMongoDB = async () => {
    try {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB");

        // Set the database you want to work with
        db = client.db('WM_DB'); // Replace 'yourDatabaseName' with your actual database name
        console.log("DB"+ db);
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
        throw error; // Rethrow the error for the caller to handle
    }
};

const getDb = () => {
    if (!db) {
        throw new Error("No database connection. Did you forget to call connectToMongoDB?");
    }
    return db;
};

const closeConnection = async () => {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed");
    }
};

// module.exports = { connectToMongoDB, getDb, closeConnection };
