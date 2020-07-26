import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    quizzes: [Quiz!]!
    quiz(id: ID!): Quiz!
  }

  type Quiz {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }
`;
