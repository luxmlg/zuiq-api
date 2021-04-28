import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		quizzes: QuizzesResponse!
		quiz(id: ID!): QuizResponse!
	}

	extend type Mutation {
		createQuiz(name: String!, schema: String, answers: String): QuizResponse!
		deleteQuiz(id: ID!): RequestResponse!
		updateQuiz(id: ID!, name: String!, schema: String, answers: String): QuizResponse!

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

	type QuizResponse {
		success: Boolean
		message: String
		quiz: Quiz
	}

	type QuizzesResponse {
		success: Boolean
		message: String
		quizzes: [Quiz]!
	}
`;
