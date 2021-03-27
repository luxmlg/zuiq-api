import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { isAuthenticated, isMeetingOwner } from "./authorization";
import quiz from "./quiz";

const createUrlToken = async (meeting, secret) => {
	const { id, name, startTime, endTime } = meeting;
	return await jwt.sign({ id, name, startTime, endTime }, secret, {
		expiresIn: endTime - startTime,
	});
};

export default {
	Query: {
		meetings: async (parent, { userId }, { models }) => {
			return await models.Meeting.findAll({
				// where: {
				//   userId,
				// },
			});
		},
		meeting: async (parent, { id }, { models }) => {
			return await models.Meeting.findByPk(id);
		},
		validateMeeting: async (parent, { meetingToken, participantToken }, { models, secret }) => {
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
						message: "Current participant token does not correspond to this meeting",
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
		},
	},

	Mutation: {
		createMeeting: async (parent, { name, quizId, startTime, endTime }, { models, secret }) => {
			const meetingObj = { id: uuidv4(), name, startTime, endTime };
			const meeting = await models.Meeting.create({
				...meetingObj,
				quizId,
				userId: "d7a94282-9462-4f6d-9f51-db918dfdf900", // shouldn't be const
				token: await createUrlToken(meetingObj, secret),
			});

			return meeting;
		},

		deleteMeeting: combineResolvers(
			//isAuthenticated,
			//isMeetingOwner,
			async (parent, { id }, { models, me }) => {
				return await models.Meeting.destroy({ where: { id } });
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
