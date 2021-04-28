import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		me: UserResponse
	}

	extend type Mutation {
		googleAuthentication(tokenId: String): TokenResponse!
		deleteUser(id: ID!): RequestResponse!
	}

	type User {
		id: ID!
		username: String!
		email: String!
		quizzes: [Quiz!]
		meetings: [Meeting!]
		role: String!
	}

	type UserResponse {
		success: Boolean
		message: String
		user: User
	}
`;
