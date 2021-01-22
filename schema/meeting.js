import { gql } from "apollo-server-express";

// meetings should be fetched using user id
export default gql`
  extend type Query {
    meetings: [Meeting]!
    meeting(id: ID!): Meeting!
  }

  extend type Mutation {
    createMeeting(
      name: String!
      quizId: ID!
      startTime: Date!
      endTime: Date!
    ): Meeting!
    deleteMeeting(id: ID!): Boolean!
  }

  type Meeting {
    id: ID!
    quiz: Quiz!
    name: String!
    token: String!
    startTime: Date!
    endTime: Date!
  }
`;
