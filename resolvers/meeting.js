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
        //   UserId: userId,
        // },
      });
    },
    meeting: async (parent, { id }, { models }) => {
      return await models.Meeting.findByPk(id);
    },
  },

  Mutation: {
    createMeeting: async (
      parent,
      { name, quizId, startTime, endTime },
      { models, secret }
    ) => {
      const meetingObj = { id: uuidv4(), name, startTime, endTime };
      const meeting = await models.Meeting.create({
        ...meetingObj,
        QuizId: quizId,
        token: await createUrlToken(meetingObj, secret),
      });

      return meeting;
    },

    deleteMeeting: combineResolvers(
      //isAuthenticated,
      //isMeetingOwner,
      async (parent, { id }, { models, me }) => {
        return await models.Meeting.destroy({ where: { id } });
      }
    ),
  },
};
