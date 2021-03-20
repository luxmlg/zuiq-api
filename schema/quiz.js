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
	}

	type Quiz {
		id: ID!
		name: String!
		schema: String
		answers: String
		createdAt: Date!
		user: User!
	}
`;
