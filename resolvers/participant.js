import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";

import { isParticipant } from "./authorization";

const createParticipantToken = async (participant, secret, expiresIn) => {
  const { id, name } = participant;
  return await jwt.sign({ id, name }, secret, { expiresIn });
};

export default {
  Query: {
    participants: async (parent, { meetingId }, { models }) => {
      return models.Participant.findAll({
        where: {
          MeetingId: meetingId,
        },
      });
    },

    participant: async (parent, { id }, { models }) => {
      return models.Participant.findByPk(id);
    },
  },

  Mutation: {
    createParticipant: async (
      parent,
      { name, meetingId },
      { models, secret }
    ) => {
      const participant = await models.Participant.create({
        id: uuidv4(),
        name,
        MeetingId: meetingId,
      });

      return { token: createParticipantToken(participant, secret, "30m") }; // expires in should'be a variable
    },

    updateAnswers: combineResolvers(
      isParticipant,
      async (parent, { answers }, { models, participantMe: { id } }) => {
        const participant = await models.Participant.findByPk(id);
        if (participant) {
          participant.update({ answers: answers });
        }

        return participant;
      }
    ),

    completeMeeting: combineResolvers(
      isParticipant,
      async (parent, args, { models, participantMe: { id } }) => {
        const participant = await models.Participant.findByPk(id);
        if (participant) {
          participant.update({ hasCompleted: true });
        }

        return participant;
      }
    ),
  },
};
