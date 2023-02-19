// basic imports: express, mongoose
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// get cors to avoid issues with Cross-Origin once frontend is built
const cors = require('cors');

// get the schema and resolver
const TypeDefs = require('./schema')
const Resolvers = require('./resolvers')

// import apollo server
const { ApolloServer } = require('apollo-server-express')

// hide secrets in environment variables
const envVars = require('dotenv');
envVars.config();

// set up the db connection string
const mongodb_atlas_url = process.env.MONGODB_URL;

// connect to db using mongoose
mongoose.connect(mongodb_atlas_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Connected to MongoDB successfully')
}).catch(err => {
  console.log('Error connecting to MongoBD: ' + err)
});

// set up the apollo server with the schema and resolver
const server = new ApolloServer({
  typeDefs: TypeDefs.typeDefs,
  resolvers: Resolvers.resolvers
})

// set up Express Server including body parser and cors
const app = express();
app.use(bodyParser.json());
app.use('*', cors());

// use express as middleware
server.applyMiddleware({app})

//console.log(server)

// fire up the ol' server
app.listen({ port: process.env.PORT }, () =>
  console.log(`Server listening at http://localhost:${process.env.PORT}${server.graphqlPath}`));
