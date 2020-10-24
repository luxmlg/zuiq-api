import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import quizResolvers from "./quiz";
import participantResolvers from "./participant";
import meetingResolvers from "./meeting";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  quizResolvers,
  participantResolvers,
  meetingResolvers,
];
