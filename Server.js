const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // '*' allows all origins
    next();
  });

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
//declare global variable for DB

const db = client.db('WM_DB');
// GET request handler for /customers
app.get('/customers', async (req, res) => {
    try {
        const collection = db.collection('Customer');

        // Using projection to fetch only the CUSTOMERID field
        const projection = { CUSTOMERID: 1, _id: 0 };
        const customers = await collection.find({}, { projection: projection }).toArray();

        res.json(customers);
    } catch (error) {
        res.status(500).send("Error fetching customers: " + error.message);
    }
});

// To get investments of Active status of a particular Customer id
app.get('/api/iacc/active/:customerId', async (req, res) => {
  try {
    const Investment_Accounts = db.collection('Investment_Accounts');
    const customerId = parseInt(req.params.customerId, 10); // Convert to number if necessary
    console.log("Querying for customerId:", customerId);
    const activeAccounts = await Investment_Accounts.find({
      CUSTOMERID: customerId,
      INVESTMENTSTATUS: 'Active'
    }).toArray(); // Convert cursor to array

    res.json({ activeAccounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function calculateInvestmentPercentages(data) {
  let totalInvestment = 0;
  const investmentByType = {};

  // Sum the total investment and group by account type
  data.activeAccounts.forEach(account => {
      totalInvestment += account.INVESTMENTPORTFOLIO;
      if (investmentByType[account.ACCOUNTTYPE]) {
          investmentByType[account.ACCOUNTTYPE] += account.INVESTMENTPORTFOLIO;
      } else {
          investmentByType[account.ACCOUNTTYPE] = account.INVESTMENTPORTFOLIO;
      }
  });

  // Calculate the percentage for each account type
  const percentages = Object.keys(investmentByType).map(type => {
      return {
          accountType: type,
          percentage: (investmentByType[type] / totalInvestment * 100).toFixed(2) + '%'
      };
  });

  // return percentages;
}


// Start the server and connect to MongoDB
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await connectToMongoDB();
});
