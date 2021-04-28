import "dotenv/config";
import jwt from "jsonwebtoken";
import passport from "passport";
import { combineResolvers } from "graphql-resolvers";
import { AuthenticationError, UserInputError } from "apollo-server";
import { v4 as uuidv4 } from "uuid";

import client from "../utils/google-oauth";

import { isAdmin } from "./authorization";
import user from "../schema/user";

const createUserToken = async (user, secret, expiresIn) => {
	const { id, email, username } = user;
	return await jwt.sign({ id, email, username }, secret, { expiresIn });
};

export default {
	Query: {
		me: async (parent, args, { models, me }) => {
			try {
				if (!me) {
					return {
						success: false,
						message: "User not authenticated or token out of date",
						user: null,
					};
				}

				const user = await models.User.findByPk(me.id);

				if (!user) {
					return {
						success: false,
						message: "Couldn't find user in database",
						user: null,
					};
				}

				return {
					success: true,
					message: "Me user retrieved successfully",
					user,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't retrieve me user",
					user: null,
				};
			}
		},
	},

	Mutation: {
		googleAuthentication: async (parent, { tokenId }, { models, secret }) => {
			try {
				const ticket = await client.verifyIdToken({
					idToken: tokenId,
					audience: process.env.GOOGLE_CLIENT_ID,
				});

				if (!ticket) {
					return {
						success: false,
						message: "Couldn't verify the IdToken",
						token: null,
					};
				}

				const payload = ticket.getPayload();
				const { name, email } = payload;

				const [user] = await models.User.findOrCreate({
					where: { email },
					defaults: { id: uuidv4(), username: name, password: "jubalubaikakuna123" },
				});

				if (!user) {
					return {
						success: false,
						message: "Couldn't create or find user in database",
						token: null,
					};
				}

				const token = createUserToken(user, secret, "2h");

				return { success: true, message: "Google authentication successfull", token };
			} catch (error) {
				return {
					success: false,
					message: "Something went wrong while trying to authenticate user with google",
					token: null,
				};
			}
		},

		deleteUser: combineResolvers(isAdmin, async (parent, { id }, { models }) => {
			try {
				const userDeleted = await models.User.destroy({ where: { id } });
				if (!userDeleted) {
					return {
						success: false,
						message: "Couldn't delete user",
					};
				}

				return {
					success: true,
					message: "User deleted successfully",
				};
			} catch (error) {
				return {
					success: false,
					message: "Something went wrong while deleting user",
				};
			}
		}),
	},

	User: {
		quizzes: async (user, args, { models }) => {
			return await models.Quiz.findAll({
				where: {
					userId: user.id,
				},
			});
		},
		meetings: async (user, args, { models }) => {
			return await models.Meeting.findAll({
				where: {
					userId: user.id,
				},
			});
		},
	},
};
