import { gql } from "apollo-server-express";

// needs query participantMeeting: Meeting!
export default gql`
	extend type Query {
		participants(meetingId: ID!): ParticipantsResponse!
		participant(id: ID!): ParticipantResponse!
		getParticipantUsingToken(token: String!): ParticipantResponse!
	}

	extend type Mutation {
		createParticipant(name: String!, token: String!): TokenResponse!
		updateAnswers(answers: String!): RequestResponse!
		completeMeeting: RequestResponse!
	}

	type ParticipantResponse {
		success: Boolean
		message: String
		participant: Participant
	}

	type ParticipantsResponse {
		success: Boolean
		message: String
		participants: [Participant]!
	}

	type Participant {
		id: ID!
		meeting: Meeting
		name: String!
		email: String!
		hasCompleted: Boolean!
		answers: String
	}
`;
