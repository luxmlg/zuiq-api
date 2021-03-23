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
			if (!me) {
				return null;
			}

			return await models.User.findByPk(me.id);
		},
		users: async (parent, args, { models }) => {
			return await models.User.findAll();
		},

		user: async (parent, { id }, { models }) => {
			return await models.User.findByPk(id);
		},
	},

	Mutation: {
		googleAuthentication: async (parent, { tokenId }, { models, secret }) => {
			console.log(client.verifyIdToken);

			const ticket = await client.verifyIdToken({
				idToken: tokenId,
				audience: process.env.GOOGLE_CLIEND_ID,
			});

			const payload = ticket.getPayload();
			const { name, email } = payload;
			console.log(payload);

			const [user] = await models.User.findOrCreate({
				where: { email },
				defaults: { id: uuidv4(), username: name, password: "jubalubaikakuna123" },
			});

			return { token: createUserToken(user, secret, "30m") };
		},

		signUp: async (parent, { username, email, password }, { models, secret }) => {
			const user = await models.User.create({
				id: uuidv4(),
				username,
				email,
				password,
			});

			return { token: createUserToken(user, secret, "30m") };
		},

		signIn: async (parent, { login, password }, { models, secret }) => {
			const user = await models.User.findByLogin(login);

			if (!user) {
				throw new UserInputError("No user found with this credentials.");
			}
			const isValid = await user.validatePassword(password);

			if (!isValid) {
				throw new AuthenticationError("Invalid password.");
			}

			return { token: createUserToken(user, secret, "30m") };
		},

		deleteUser: combineResolvers(isAdmin, async (parent, { id }, { models }) => {
			return await models.User.destroy({ where: { id } });
		}),
	},

	User: {
		quizzes: async (user, args, { models }) => {
			return await models.Quiz.findAll({
				where: {
					UserId: user.id,
				},
			});
		},
		meetings: async (user, args, { models }) => {
			return await models.Meeting.findAll({
				where: {
					UserId: user.id,
				},
			});
		},
	},
};
