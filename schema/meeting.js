import { gql } from "apollo-server-express";

// meetings should be fetched using user id
export default gql`
	extend type Query {
		meetings: [Meeting]!
		meeting(id: ID!): Meeting!
		validateMeeting(meetingToken: String, participantToken: String): ValidateMeetingResponse!
	}

	extend type Mutation {
		createMeeting(name: String!, quizId: ID!, startTime: Date!, endTime: Date!): Meeting!
		deleteMeeting(id: ID!): Boolean!
	}

	type ValidateMeetingResponse {
		success: Boolean
		message: String
		action: String
	}

	type Meeting {
		id: ID!
		quiz: Quiz!
		name: String!
		token: String!
		participants: [Participant]!
		startTime: Date!
		endTime: Date!
	}
`;
