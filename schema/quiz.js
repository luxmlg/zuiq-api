import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    quizzes: [Quiz!]!
    quiz(id: ID!): Quiz!
  }

  extend type Mutation {
    createQuiz(name: String!, text: String!): Quiz!
    deleteQuiz(id: ID!): Boolean!
  }

  type Quiz {
    id: ID!
    name: String!
    text: String!
    createdAt: Date!
    user: User!
  }
`;
