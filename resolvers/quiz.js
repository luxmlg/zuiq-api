import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isQuizOwner } from "./authorization";

export default {
  Query: {
    quizzes: async (parent, args, { models }) => {
      return await models.Quiz.findAll();
    },

    quiz: async (parent, { id }, { models }) => {
      return await models.Quiz.findByPk(id);
    },
  },
  Mutation: {
    createQuiz: combineResolvers(
      isAuthenticated,
      async (parent, { name, text }, { models, me }) => {
        const quiz = await models.Quiz.create({
          name,
          text,
          UserId: me.id,
        });

        return quiz;
      }
    ),
    deleteQuiz: combineResolvers(
      isAuthenticated,
      isQuizOwner,
      async (parent, { id }, { models }) => {
        return await models.Quiz.destroy({ where: { id } });
      }
    ),
  },
  Quiz: {
    user: async (quiz, args, { models }) => {
      return await models.User.findByPk(quiz.UserId);
    },
  },
};
