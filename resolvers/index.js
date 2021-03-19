import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import quizResolvers from "./quiz";
import participantResolvers from "./participant";
import meetingResolvers from "./meeting";
import verificationResolvers from "./verification";

const customScalarResolver = {
	Date: GraphQLDateTime,
};

export default [
	customScalarResolver,
	userResolvers,
	quizResolvers,
	participantResolvers,
	meetingResolvers,
	verificationResolvers,
];
