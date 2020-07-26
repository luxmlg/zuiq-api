import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import quizResolvers from "./quiz";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, userResolvers, quizResolvers];
