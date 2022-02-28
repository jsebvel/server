const { gql } = require('apollo-server');

module.exports = gql`
    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type User {
        id: ID!
        email:String!
        token: String!
        username: String!
        createdAt: String!
    }

    type Repo {
        id: ID!
        username: String!
        owner: String!
        fullName: String!
        name: String!
        url: String!
        gitUrl: String!
        liked: Boolean!
        repoId: String!
        language: String
    }

    type Query {
        getFavRepos: [Repo]
        getRepo(repoId: String): Repo
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(email:String!, password: String!): User!
        createFavRepo( 
            username: String!,
            owner: String!,
            fullName: String!,
            name: String!,
            url: String!,
            gitUrl: String!,
            liked: Boolean!
            repoId: String!
            id: ID,
            language: String
        ): Repo
    }
`