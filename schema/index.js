import { gql } from "apollo-server-express";

import userSchema from "./user";
import quizSchema from "./quiz";
import meetingSchema from "./meeting";
import participantSchema from "./participant";
import verificationSchema from "./verification";

const linkSchema = gql`
	scalar Date

	type Token { #need to find a better place for this
		token: String!
	}

	type RequestResponse {
		success: Boolean
		message: String
	}

	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`;

export default [
	linkSchema,
	userSchema,
	quizSchema,
	meetingSchema,
	participantSchema,
	verificationSchema,
];
