import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { isAuthenticated, isMeetingOwner } from "./authorization";

const createUrlToken = async (meeting, secret) => {
	const { id, name, startTime, endTime } = meeting;
	return await jwt.sign({ id, name, startTime, endTime }, secret, {
		expiresIn: endTime - startTime,
	});
};

export default {
	Query: {
		meetings: async (parent, args, { me, models }) => {
			try {
				const meetings = await models.Meeting.findAll({
					where: {
						userId: me.id,
					},
				});

				if (!meetings) {
					return {
						success: false,
						message: "Couldn't retrieve the meetings",
						meetings: [],
					};
				}

				return {
					success: true,
					message: "Meetings retrieve successfully",
					meetings,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't retrieve the meetings",
					meetings: [],
				};
			}
		},
		meeting: async (parent, { id }, { models }) => {
			try {
				const meeting = await models.Meeting.findByPk(id);
				if (!meeting) {
					return {
						success: false,
						message: "Couldn't retrieve the meeting",
						meeting: null,
					};
				}

				return {
					success: true,
					message: "Meeting retrieve successfully",
					meeting,
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't retrieve the meeting",
					meeting: null,
				};
			}
		},
		validateMeeting: async (parent, { meetingToken, participantToken }, { models, secret }) => {
			try {
				const decodedMeetingToken = jwt.verify(meetingToken, secret);

				if (participantToken) {
					const decodedParticipantToken = jwt.verify(participantToken, secret);
					const foundParticipant = await models.Participant.findOne({
						where: { id: decodedParticipantToken.id },
					});

					if (!foundParticipant) {
						return {
							success: false,
							message: "Participant not found",
							action: "pass",
						};
					}

					if (foundParticipant.meetingId !== decodedMeetingToken.id) {
						return {
							success: false,
							message:
								"Current participant token does not correspond to this meeting",
							action: "deauthenticate",
						};
					}
				}

				const foundMeeting = await models.Meeting.findOne({
					where: {
						id: decodedMeetingToken.id,
					},
				});

				if (!foundMeeting) {
					return {
						success: false,
						message: "Meeting not found",
						action: "pass",
					};
				}

				const nowTime = Date.now();
				const meetingStartTime = new Date(foundMeeting.startTime);

				if (nowTime < meetingStartTime) {
					return {
						success: false,
						message: "Meeting has not started yet",
						action: "error",
					};
				}

				return {
					success: true,
					message: "No issues with this meeting",
					action: "pass",
				};
			} catch (error) {
				return {
					success: false,
					message: "Couldn't validate the meeting",
					action: "error",
				};
			}
		},
	},

	Mutation: {
		createMeeting: combineResolvers(
			isAuthenticated,
			async (parent, { name, quizId, startTime, endTime }, { me, models, secret }) => {
				try {
					const meetingObj = { id: uuidv4(), name, startTime, endTime };
					const meeting = await models.Meeting.create({
						...meetingObj,
						quizId,
						userId: me.id,
						token: await createUrlToken(meetingObj, secret),
					});

					if (!meeting) {
						return {
							success: false,
							message: "Couldn't create the meeting",
							meeting: null,
						};
					}

					return {
						success: true,
						message: "Meeting successfully created",
						meeting,
					};
				} catch (error) {
					return {
						success: false,
						message: "Something went wrong while creating meeting",
						meeting: null,
					};
				}
			},
		),

		deleteMeeting: combineResolvers(
			isAuthenticated,
			isMeetingOwner,
			async (parent, { id }, { models, me }) => {
				try {
					const deletedMeeting = await models.Meeting.destroy({ where: { id } });
					if (deletedMeeting) {
						return {
							success: true,
							message: "Meeting has been deleted successfully",
						};
					} else {
						return {
							success: false,
							message: "Failed to delete the meeting",
						};
					}
				} catch (error) {
					return {
						success: false,
						message: "Failed to delete the meeting",
					};
				}
			},
		),
	},

	Meeting: {
		quiz: async (meeting, args, { models }) => {
			return await models.Quiz.findByPk(meeting.quizId);
		},
		participants: async (meeting, args, { models }) => {
			return await models.Participant.findAll({
				where: { meetingId: meeting.id },
			});
		},
	},
};
