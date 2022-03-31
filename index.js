const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { ApolloServer } = require( 'apollo-server-express');
const resolvers = require( './schema/resolvers');
const typeDefs = require( './schema/typedefs');

const port = process.env.PORT || 4000;
const db = require('./config/database/mongoconnect')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

const app = express();
app.use(cors());
server.applyMiddleware({ app });

// app.get('/', (req, res) => {
//   console.log("Apollo GraphQL Express server is ready");
// });

db.once("open", () => {
  console.log("Connected successfully to MongoDB");
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
});