import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    users: [User!]
    user(id: ID!): User
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!
    signIn(login: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    quizzes: [Quiz!]
    meetings: [Meeting!]
    role: String!
  }
`;
