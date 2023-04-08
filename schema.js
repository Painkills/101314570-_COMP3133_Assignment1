const { gql } = require('apollo-server-express');

exports.typeDefs = gql `
    type Employee {
        id: String!
        firstname: String!
        lastname: String!
        email: String!
        gender: String!
        salary: Float!
    }

    type User {
        id: String!
        username: String!
        password: String!
        email: String!
    }

    type Query {
        getEmployees: [Employee]
        getEmployeeByID(id: String!): Employee
        login(username: String!, password: String!): User
    }

    type Mutation {
        addEmployee(firstname: String!
            lastname: String!
            email: String!
            gender: String!
            salary: Float!): Employee

        updateEmployee(id: String!
            firstname: String!
            lastname: String!
            email: String!
            gender: String!
            salary: Float!): Employee
        
        deleteEmployee(id: String!): String

        register(username: String!
            email: String!
            password: String!): User
    }
`