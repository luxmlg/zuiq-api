import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";

import { isParticipant } from "./authorization";

export const createParticipantToken = async (participant, secret, expiresIn) => {
	const { id, name } = participant;
	return await jwt.sign({ id, name }, secret, { expiresIn });
};

export default {
	Query: {
		participants: async (parent, { meetingId }, { models }) => {
			return models.Participant.findAll({
				where: {
					meetingId,
				},
			});
		},

		participant: async (parent, { id }, { models }) => {
			return models.Participant.findByPk(id);
		},

		getParticipantUsingToken: async (parent, { token }, { models, secret }) => {
			const participantToken = await jwt.verify(token, secret);
			const participantId = participantToken.id;
			return models.Participant.findByPk(participantId);
		},
	},

	Mutation: {
		createParticipant: async (parent, { name, token }, { models, secret }) => {
			const urlToken = jwt.verify(token, secret);
			console.log("urlToken", urlToken);

			const participant = await models.Participant.create({
				id: uuidv4(),
				name,
				meetingId: urlToken.id,
			});

			return { token: createParticipantToken(participant, secret, "30m") }; // expires in should'be a variable (urlToken.endTime - urlToken.startTime)
		},

		updateAnswers: combineResolvers(
			isParticipant,
			async (parent, { answers }, { models, participantMe: { id } }) => {
				const participant = await models.Participant.findByPk(id);
				if (participant) {
					participant.update({ answers: answers });
				}

				return participant;
			},
		),

		completeMeeting: combineResolvers(
			isParticipant,
			async (parent, args, { models, participantMe: { id } }) => {
				const participant = await models.Participant.findByPk(id);
				if (participant) {
					participant.update({ hasCompleted: true });
				}

				return participant;
			},
		),
	},
	Participant: {
		meeting: async (participant, args, { models }) => {
			return await models.Meeting.findByPk(participant.meetingId);
		},
	},
};
