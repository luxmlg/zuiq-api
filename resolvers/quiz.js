import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";
import { cloudinary } from "../utils/cloudinary";

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
					UserId: "25cb04e5-3339-45a6-b8c3-1a8842b0dcd4", //me.id,
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
			return await models.User.findByPk(quiz.UserId);
		},
	},
};
