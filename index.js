const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { ApolloServer, gql } = require( 'apollo-server-express');
const resolvers = require( './components/schema/_resolvers');
const typeDefs = require( './components/schema/typeDefs');

const homeRoutes = require('./components/routes/home')
const port = process.env.PORT || 4000;
const db = require('./components/database/mongoconnect')

const serverStart = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    //playground: true,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server listening at ${port}`)
  });
  app.use('/',homeRoutes);
} 



db.once("open", () => {
  console.log("Connected successfully to MongoDB");
  serverStart()
});