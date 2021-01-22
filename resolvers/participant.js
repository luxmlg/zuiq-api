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
      const a = await models.Participant.findOne({
        where: {
          id,
        },
        include: {
          model: models.Meeting,
          // required: true,
        },
      });
      console.log(a);
      return a;

      return models.Participant.findOne({
        where: {
          id,
        },
        include: {
          model: models.Meeting,
          // required: true,
        },
      });
    },
  },

  Mutation: {
    createParticipant: async (parent, { name, token }, { models, secret }) => {
      const urlToken = jwt.verify(token, process.env.SECRET);
      console.log("urlToken", urlToken);

      const participant = await models.Participant.create({
        id: uuidv4(),
        name,
        MeetingId: urlToken.id,
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
