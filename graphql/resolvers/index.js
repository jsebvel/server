const userResolvers = require('./users');
const repoResolvers = require('./repos');

module.exports = {
    Query: {
        ...repoResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...repoResolvers.Mutation
    }
}