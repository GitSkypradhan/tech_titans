const mongodbConnection = require('./MongodbConnection.js');

async function fetchCustomerIDs() {
    try {
        const db = mongodbConnection.getDb();
        if (!db) {
            throw new Error("No database connection.");
        }

        const collection = db.collection("Customer"); // Replace with your collection name

        // Fetch customer IDs
        const customers = await collection.find({}, { projection: { CUSTOMERID: 1 } }).toArray();
        const customerIDs = customers.map(customer => customer.CUSTOMERID.toString());

        console.log("Customer IDs:", customerIDs);
        return customerIDs;
    } catch (err) {
        console.error("Error fetching customer IDs:", err);
    }
}

// Connect to MongoDB and then fetch customer IDs
mongodbConnection.connectToServer((err) => {
    if (err) {
        console.error(err);
        return;
    }
    fetchCustomerIDs();
});
