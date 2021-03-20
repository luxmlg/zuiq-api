import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";

import { isAuthenticated, isQuizOwner } from "./authorization";

export default {
	Query: {
		quizzes: async (parent, args, { models }) => {
			return await models.Quiz.findAll();
		},

		quiz: async (parent, { id }, { models }) => {
			return await models.Quiz.findByPk(id);
		},
	},
	Mutation: {
		createQuiz: combineResolvers(
			//isAuthenticated,
			async (parent, { name, schema, answers }, { models, me }) => {
				const quiz = await models.Quiz.create({
					id: uuidv4(),
					name,
					schema,
					answers,
					UserId: "1a9f83bd-4c64-4e8f-85a3-d29a1b8f5999", //me.id,
				});

				return quiz;
			},
		),
		deleteQuiz: combineResolvers(
			//isAuthenticated,
			//isQuizOwner,
			async (parent, { id }, { models }) => {
				return await models.Quiz.destroy({ where: { id } });
			},
		),
		updateQuiz: combineResolvers(
			//isAuthenticated,
			//isQuizOwner,
			async (parent, { id, name, schema, answers }, { models }) => {
				const quiz = await models.Quiz.findByPk(id);
				if (quiz) {
					quiz.update({
						id,
						name,
						schema,
						answers,
					});
				}

				return quiz;
			},
		),
	},
	Quiz: {
		user: async (quiz, args, { models }) => {
			return await models.User.findByPk(quiz.UserId);
		},
	},
};
