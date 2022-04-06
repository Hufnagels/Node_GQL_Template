const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { ApolloServer, AuthenticationError, ForbiddenError, UserInputError } = require( 'apollo-server-express');
const resolvers = require( './components/schema/resolvers');
const typeDefs = require( './components/schema/typeDefs');

const AppError = require('./components/controllers/AppErrorController');
const errorController = require('./components/controllers/errorController');

const homeRoutes = require('./components/routes/home')
const port =  4002;
const db = require('./components/database/mongoconnect')

const serverStart = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  /*
  app.use(errorController)
   */
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    //playground: true,
    // formatError: (err) => {
    //   // Don't give the specific errors to the client.
    //   if (err.message.startsWith('Database Error: ')) {
    //     return new Error('Internal server error');
    //   }
    //   // Otherwise return the original error. The error can also
    //   // be manipulated in other ways, as long as it's returned.
    //   return err;
    // },
  })

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });
 
  app.listen(port, () => {
    console.log(`Server listening at ${port}`)
    console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  })
  app.use('/',homeRoutes);
} 

db.once("open", () => {
  console.log("Connected successfully to MongoDB");
  console.log("Starting Apollo server...");
  serverStart()
});