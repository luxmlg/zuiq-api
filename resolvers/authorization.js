import { ForbiddenError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated as user.");

export const isParticipant = (parent, args, { participantMe }) =>
  participantMe
    ? skip
    : new ForbiddenError("Not authenticated as participant.");

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => {
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.");
  }
);

export const isQuizOwner = async (parent, { id }, { models, me }) => {
  const quiz = await models.Quiz.findByPk(id, { raw: true });

  if (quiz.UserId != me.id) {
    throw new ForbiddenError("Not authenticated as quiz owner.");
  }

  return skip;
};

// find a way to use combineResolvers instead
export const isMeetingOwner = async (parent, { id }, { models, me }) => {
  const meeting = await models.Meeting.findByPk(id, { raw: true });

  const quizId = meeting.QuizId;
  const quiz = await models.Quiz.findByPk(quizId, { raw: true });

  if (quiz.UserId != me.id) {
    throw new ForbiddenError("Not authenticated as meeting owner.");
  }

  return skip;
};
