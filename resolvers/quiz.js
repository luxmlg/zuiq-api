import { combineResolvers } from "graphql-resolvers";
import { createWriteStream } from "fs";
import { v4 as uuidv4 } from "uuid";

import models from "../models";
import { isAuthenticated, isQuizOwner } from "./authorization";

const uploadDir = `images`;

const storeUpload = async ({ stream, filename }) => {
  const id = uuidv4();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path }))
      .on("error", reject)
  );
};

const recordFile = (file) => models.Image.create(file);

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype, encoding } = await upload;
  const stream = createReadStream();
  const { id, path } = await storeUpload({ stream, filename });
  return recordFile({ id, filename, mimetype, encoding, path });
};

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
          id: uuidv4(),
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
    singleUpload: (parent, { file }) => processUpload(file),
  },
  Quiz: {
    user: async (quiz, args, { models }) => {
      return await models.User.findByPk(quiz.UserId);
    },
  },
};
