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
			try {
				const participants = models.Participant.findAll({
					where: {
						meetingId,
					},
				});

				if (!participants) {
					return {
						success: false,
						message: "Couldn't retrieve the participants from database",
						participants: [],
					};
				}

				return {
					success: true,
					message: "Participants retrieved successfully",
					participants,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't retrieve the participants",
					participants: [],
				};
			}
		},

		participant: async (parent, { id }, { models }) => {
			try {
				const participant = models.Participant.findByPk(id);

				if (!participant) {
					return {
						success: false,
						message: "Couldn't retrieve the participant from database",
						participant: null,
					};
				}

				return {
					success: true,
					message: "Participant retrieved successfully",
					participant,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't retrieve the participant",
					participant: null,
				};
			}
		},

		getParticipantUsingToken: async (parent, { token }, { models, secret }) => {
			try {
				const participantToken = await jwt.verify(token, secret);
				if (!participantToken) {
					return {
						success: false,
						message: "Couldn't verify the participants token",
						participant: null,
					};
				}
				const participantId = participantToken.id;
				const participant = models.Participant.findByPk(participantId);

				if (!participant) {
					return {
						success: false,
						message: "Couldn't retrieve the participant from database",
						participant: null,
					};
				}

				return {
					success: true,
					message: "Participant retrieved successfully",
					participant,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't retrieve the participant from database",
					participant: null,
				};
			}
		},
	},

	Mutation: {
		createParticipant: async (parent, { name, token }, { models, secret }) => {
			try {
				const urlToken = jwt.verify(token, secret);
				console.log("urlToken", urlToken);
				if (!urlToken) {
					return {
						success: false,
						message: "Couldn't verify urlToken",
						token: null,
					};
				}

				const participant = await models.Participant.create({
					id: uuidv4(),
					name,
					meetingId: urlToken.id,
				});

				if (!participant) {
					return {
						success: false,
						message: "Couldn't create participant in DB",
						token: null,
					};
				}

				const participantToken = createParticipantToken(participant, secret, "30m"); // expires in should'be a variable (urlToken.endTime - urlToken.startTime)
				if (!participantToken) {
					return {
						success: false,
						message: "Couldn't create participant token",
						token: null,
					};
				}

				return {
					success: true,
					message: "Participant successfully created",
					token: participantToken,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't create the participant",
					token: null,
				};
			}
		},

		updateAnswers: combineResolvers(
			isParticipant,
			async (parent, { answers }, { models, participantMe: { id } }) => {
				try {
					const participant = await models.Participant.findByPk(id);
					if (!participant) {
						return {
							success: false,
							message: "Couldn't find the participant",
						};
					}

					const updateAnswers = participant.update({ answers: answers });
					if (!updateAnswers) {
						return {
							success: false,
							message: "Couldn't update participants answers in DB",
						};
					}

					return {
						success: true,
						message: "Answers updated successfully",
					};
				} catch (error) {
					return {
						success: false,
						message: "Couldn't update the answers",
					};
				}
			},
		),

		completeMeeting: combineResolvers(
			isParticipant,
			async (parent, args, { models, participantMe: { id } }) => {
				try {
					const participant = await models.Participant.findByPk(id);

					if (!participant) {
						return {
							success: false,
							message: "Couldn't find the participant in database",
						};
					}
					participant.update({ hasCompleted: true });

					return {
						success: true,
						message: "Meeting completed successfully",
					};
				} catch (error) {
					return {
						success: true,
						message: "Couldn't complete the Meeting",
					};
				}
			},
		),
	},
	Participant: {
		meeting: async (participant, args, { models }) => {
			return await models.Meeting.findByPk(participant.meetingId);
		},
	},
};
