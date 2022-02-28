const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const User = require('./models/User');
const Repo = require('./models/Repo')

const typeDefs = require('./graphql/TypeDefs');
const { MONGODB } = require('./config.js');
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    });

// server.listen({ port: 5000 })