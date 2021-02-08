import { gql } from "apollo-server-express";

// needs query participantMeeting: Meeting!
export default gql`
  extend type Query {
    participants(meetingId: ID!): [Participant]!
    participant(id: ID!): Participant!
    getParticipantUsingToken(token: String!): Participant!
  }

  extend type Mutation {
    createParticipant(name: String!, token: String!): Token!
    updateAnswers(answers: String!): Participant
    completeMeeting: Participant
  }

  type Participant {
    id: ID!
    meeting: Meeting
    name: String!
    hasCompleted: Boolean!
    answers: String
  }
`;
