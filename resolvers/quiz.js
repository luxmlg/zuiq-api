import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";
import { cloudinary } from "../utils/cloudinary";

import { isAuthenticated, isQuizOwner } from "./authorization";

export default {
	Query: {
		getQuizzes: async (parent, args, { me, models }) => {
			try {
				const quizzes = await models.Quiz.findAll({
					where: {
						userId: me.id,
					},
				});

				if (!quizzes) {
					return {
						success: false,
						message: "Couln't retrieve the quizzes from database",
						quizzes: null,
					};
				}

				return {
					success: true,
					message: "Quizzes retrieved successfully",
					quizzes,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couln't retrieve the quizzes",
					quizzes: null,
				};
			}
		},

		getQuiz: async (parent, { id }, { models }) => {
			try {
				const quiz = await models.Quiz.findByPk(id);

				if (!quiz) {
					return {
						success: false,
						message: "Couln't retrieve the quiz from database",
						quiz: null,
					};
				}

				return {
					success: true,
					message: "Quiz retrieved successfully",
					quiz,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couln't retrieve the quiz",
					quiz: null,
				};
			}
		},
	},
	Mutation: {
		createQuiz: combineResolvers(
			isAuthenticated,
			async (parent, { name, schema, answers }, { models, me }) => {
				try {
					const quiz = await models.Quiz.create({
						id: uuidv4(),
						name,
						schema,
						answers,
						userId: me.id,
					});

					if (!quiz) {
						return {
							success: true,
							message: "Couldn't create quiz in database",
							quiz,
						};
					}

					return {
						success: true,
						message: "Quiz created successfully",
						quiz,
					};
				} catch (error) {
					return {
						success: true,
						message: "Couldn't create quiz",
						quiz,
					};
				}
			},
		),
		deleteQuiz: combineResolvers(
			isAuthenticated,
			isQuizOwner,
			async (parent, { id }, { models }) => {
				try {
					const quizDeleted = await models.Quiz.destroy({ where: { id } });

					if (!quizDeleted) {
						return {
							success: false,
							message: "Couldn't delete the quiz",
						};
					}

					return {
						success: true,
						message: "Quiz deleted successfully",
					};
				} catch (error) {
					return {
						success: false,
						message: "Couldn't delete the quiz",
					};
				}
			},
		),
		updateQuiz: combineResolvers(
			isAuthenticated,
			isQuizOwner,
			async (parent, { id, name, schema, answers }, { models }) => {
				try {
					const quiz = await models.Quiz.findByPk(id);
					if (!quiz) {
						return {
							success: false,
							message: "Couldn't find the quiz in database",
							quiz: null,
						};
					}

					quiz.update({
						id,
						name,
						schema,
						answers,
					});

					return { success: true, message: "Quiz updated successfully", quiz };
				} catch (error) {
					return {
						success: false,
						message: "Couldn't update the quiz",
						quiz: null,
					};
				}
			},
		),
		uploadImage: async (parent, { image }, { models }) => {
			try {
				console.log(image);
				const uploadResponse = await cloudinary.uploader.upload(image, {
					upload_preset: "ml_default",
				});
				console.log(uploadResponse);

				return {
					success: true,
					message: "Image successfully uploaded",
					path: uploadResponse.url,
				};
			} catch {
				return { success: false, message: "Unable to upload image", path: null };
			}
		},
	},
	Quiz: {
		user: async (quiz, args, { models }) => {
			return await models.User.findByPk(quiz.userId);
		},
	},
};
