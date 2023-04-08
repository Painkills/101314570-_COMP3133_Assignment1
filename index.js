// basic imports: express, mongoose
import express from 'express';
import { connect } from 'mongoose';
import { json } from 'body-parser';

// get cors to avoid issues with Cross-Origin once frontend is built
import cors from 'cors';

// get the schema and resolver
import { typeDefs as _typeDefs } from './schema';
import { resolvers as _resolvers } from './resolvers';

// import apollo server
import { ApolloServer } from 'apollo-server-express';

// hide secrets in environment variables
import { config } from 'dotenv';
config();

// set up the db connection string
const mongodb_atlas_url = process.env.MONGODB_URL;

// connect to db using mongoose
connect(mongodb_atlas_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Connected to MongoDB successfully')
}).catch(err => {
  console.log('Error connecting to MongoBD: ' + err)
});

// set up the apollo server with the schema and resolver
const server = new ApolloServer({
  typeDefs: _typeDefs,
  resolvers: _resolvers
})

// set up Express Server including body parser and cors
const app = express();
app.use(json());
app.use(cors());
// app.use(cors({
//   origin: 'https://101314570-comp3133-assig2-5cug535rf-painkills.vercel.app'
// }))
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", ["GET", "POST", "OPTIONS", "PUT", "DELETE"]);
//   next();
// });

// use express as middleware
server.applyMiddleware({app})

//console.log(server)

// fire up the ol' server
app.listen({ port: process.env.PORT }, () =>
  console.log(`Server listening at https://101314570-comp-3133-assignment1.vercel.app/${process.env.PORT}${server.graphqlPath}`));
