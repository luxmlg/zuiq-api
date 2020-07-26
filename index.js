import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server-express";
import http from "http";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.subscribe(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: { models },
});

server.applyMiddleware({ app, path: "/graphql" });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = true;

sequelize.sync({ force: isTest }).then(async () => {
  httpServer.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
});
