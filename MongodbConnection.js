const { MongoClient } = require('mongodb');

// Replace with your MongoDB URI
const uri = "mongodb+srv://v55star:8587953116@cluster0.ubgyypf.mongodb.net";

let _db;

module.exports = {
    connectToServer: function(callback) {
        MongoClient.connect(uri, (err, client) => {
            if (err) {
                return callback(err);
            }
            _db = client.db("WM_DB"); // Replace with your database name
            console.log("Successfully connected to MongoDB.");
            return callback(null, _db);
        });
    },

    getDb: function() {
        return _db;
    }
};
