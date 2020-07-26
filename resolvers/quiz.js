export default {
  Query: {
    quizzes: async (parent, args, { models }) => {
      return await models.Quiz.findAll();
    },

    quiz: async (parent, { id }, { models }) => {
      return await models.Quiz.findByPk(id);
    },
  },
};
