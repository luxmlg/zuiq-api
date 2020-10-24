import { gql } from "apollo-server-express";

import userSchema from "./user";
import quizSchema from "./quiz";
import participantSchema from "./participant";
import meetingSchema from "./meeting";

const linkSchema = gql`
  scalar Date

  type Token { #need to find a better place for this
    token: String!
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
  participantSchema,
  meetingSchema,
];
