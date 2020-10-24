import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    meetings(userId: ID!): [Meeting]!
    meeting(id: ID!): Meeting!
  }

  extend type Mutation {
    createMeeting(name: String!, quizId: ID!, endTime: Date!): Meeting!
    deleteMeeting(id: ID!): Boolean!
  }

  type Meeting {
    id: ID!
    quiz: Quiz!
    name: String!
    startTime: Date!
    endTime: Date!
  }
`;
