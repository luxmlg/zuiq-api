import { combineResolvers } from "graphql-resolvers";
import { v4 as uuidv4 } from "uuid";

import { isAuthenticated, isMeetingOwner } from "./authorization";

export default {
  Query: {
    meetings: async (parent, { userId }, { models }) => {
      return await models.Meeting.findAll({
        where: {
          UserId: userId,
        },
      });
    },
    meeting: async (parent, { id }, { models }) => {
      return await models.Meeting.findByPk(id);
    },
  },

  Mutation: {
    createMeeting: async (parent, { name, quizId, endTime }, { models }) => {
      const meeting = await models.Meeting.create({
        id: uuidv4(),
        name,
        QuizId: quizId,
        startTime: Date.now(),
        endTime: new Date(endTime),
      });

      return meeting;
    },

    deleteMeeting: combineResolvers(
      isAuthenticated,
      isMeetingOwner,
      async (parent, { id }, { models, me }) => {
        return await models.Meeting.destroy({ where: { id } });
      }
    ),
  },
};
