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
      //isAuthenticated,
      async (parent, { name, schema }, { models, me }) => {
        const quiz = await models.Quiz.create({
          id: uuidv4(),
          name,
          schema,
          UserId: "21a34038-3308-4767-affd-115da41656a3", //me.id,
        });

        return quiz;
      }
    ),
    deleteQuiz: combineResolvers(
      //isAuthenticated,
      //isQuizOwner,
      async (parent, { id }, { models }) => {
        return await models.Quiz.destroy({ where: { id } });
      }
    ),
    updateQuiz: combineResolvers(
      //isAuthenticated,
      //isQuizOwner,
      async (parent, { id, name, schema }, { modles }) => {
        const quiz = await models.Quiz.findByPk(id);
        if (quiz) {
          quiz.update({
            id,
            name,
            schema,
          });
        }

        return quiz;
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
