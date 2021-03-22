import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		quizzes: [Quiz!]!
		quiz(id: ID!): Quiz!
	}

	extend type Mutation {
		createQuiz(name: String!, schema: String, answers: String): Quiz!
		deleteQuiz(id: ID!): Boolean!
		updateQuiz(id: ID!, name: String!, schema: String, answers: String): Quiz!

		uploadImage(image: String!): UploadImageResponse!
	}

	type Quiz {
		id: ID!
		name: String!
		schema: String
		answers: String
		createdAt: Date!
		user: User!
	}

	type UploadImageResponse {
		success: Boolean
		message: String
		path: String
	}
`;
