import { gql } from "apollo-server-express";

// meetings should be fetched using user id
export default gql`
	extend type Query {
		meetings: MeetingsResponse!
		meeting(id: ID!): MeetingResponse!
		validateMeeting(meetingToken: String, participantToken: String): ValidateMeetingResponse!
	}

	extend type Mutation {
		createMeeting(
			name: String!
			quizId: ID!
			startTime: Date!
			endTime: Date!
		): MeetingResponse!
		deleteMeeting(id: ID!): RequestResponse!
	}

	type ValidateMeetingResponse {
		success: Boolean
		message: String
		action: String
	}

	type MeetingResponse {
		success: Boolean
		message: String
		meeting: Meeting
	}

	type MeetingsResponse {
		success: Boolean
		message: String
		meetings: [Meeting]!
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
