import { gql } from "apollo-server-express";

export default gql`
	extend type Mutation {
		sendCodeToParticipant(email: String!): VerificationResponse!
		verifyParticipantCode(
			email: String!
			name: String!
			code: String!
			meetingToken: String!
		): VerificationResponse!
	}

	type VerificationResponse {
		success: Boolean!
		message: String!
		token: String
	}

	type Verification {
		id: ID!
		email: String!
		code: String!
	}
`;
