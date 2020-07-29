import { ForbiddenError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated as user.");

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => {
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.");
  }
);

export const isQuizOwner = async (parent, { id }, { models, me }) => {
  const quiz = await models.Quiz.findByPk(id, { raw: true });

  if (quiz.UserId != me.id) {
    throw new ForbiddenError("Not authenticated as owner.");
  }

  return skip;
};
