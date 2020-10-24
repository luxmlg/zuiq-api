import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    participants(meetingId: ID!): [Participant]!
    participant(id: ID!): Participant!
  }

  extend type Mutation {
    createParticipant(name: String!, meetingId: ID!): Token!
    updateAnswers(answers: String!): Participant
    completeMeeting: Participant
  }

  type Participant {
    id: ID!
    meeting: Meeting!
    name: String!
    hasCompleted: Boolean!
    answers: String!
  }
`;
