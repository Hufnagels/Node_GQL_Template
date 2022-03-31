const mongoose = require("mongoose");
// const MongoClient = require( 'mongodb' ).MongoClient;


const MDB_server = process.env.MONGODB_SERVER_ADDRESS
const MDB_dbname = process.env.MONGODB_DB;
const MDB_uname = process.env.MONGODB_USERNAME
const MDB_pwd = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb://${MDB_server}:27017/${MDB_dbname}`, {
    "auth": { "authSource": "admin" },
    "user": `${MDB_uname}`,
    "pass": `${MDB_pwd}`,
    // "useMongoClient": true,
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error to MongoDB: "));
// db.once("open", function () {
//   console.log("Connected successfully to MongoDB");
// });

module.exports = db;