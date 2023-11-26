const mongodbConnection = require('./MongodbConnection.js');

async function fetchCustomerIDs() {
    try {
        await mongodbConnection.connectToMongoDB;

        const db = mongodbConnection.getDb;
        // Perform your database operations here
        const collection = db.collection("Customer"); // Replace with your collection name
            // Fetch customer IDs
        const customers = await collection.find({}, { projection: { CUSTOMERID: 1 } }).toArray();
        const customerIDs = customers.map(customer => customer.CUSTOMERID.toString());
        return customerIDs;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

   let customerID = fetchCustomerIDs();
   console.log(customerID);
   mongodbConnection.closeConnection;
