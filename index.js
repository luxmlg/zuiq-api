import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import http from "http";
import jwt from "jsonwebtoken";
import passport from "passport";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.subscribe(cors());
app.use(passport.initialize());

passport.use(
	new GoogleStrategy(
		{
			clientID: "505627546356-imbf19e9pn7o8bkmglia2n42bfph9vud.apps.googleusercontent.com",
			clientSecret: "f8HsScKJNlyLA0G213tm2bPS",
			callbackURL: "/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, done) {
			models.User.findOne({ googleId: profile.id }).then((currentUser) => {
				if (currentUser) {
					//if we already have a record with the given profile ID
					done(null, currentUser);
				} else {
					//if not, create a new user
					new User({
						googleId: profile.id,
					})
						.save()
						.then((newUser) => {
							done(null, newUser);
						});
				}
			});
		},
	),
);

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	}),
);

app.get(
	"/auth/google/callback",
	// passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/");
	},
);

const getMe = async (req) => {
	const token = req.headers["x-token"];

	if (token) {
		try {
			return await jwt.verify(token, process.env.SECRET);
		} catch (e) {
			throw new AuthenticationError("Your session expired. Sign in again.");
		}
	}
};

const getParticipantMe = async (req) => {
	const token = req.headers["ptoken"];

	if (token) {
		try {
			console.log(token);
			return await jwt.verify(token, process.env.SECRET);
		} catch (e) {
			return null;
			//throw new AuthenticationError("Meeting ended or Invalid Token.");
		}
	}
};

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	context: async ({ req, connection }) => {
		if (connection) {
			return {
				models,
			};
		}

		if (req) {
			const me = await getMe(req);
			const participantMe = await getParticipantMe(req);
			return {
				models,
				me,
				participantMe,
				secret: process.env.SECRET,
			};
		}
	},
});

server.applyMiddleware({
	app,
	path: "/graphql",
	bodyParserConfig: {
		// needs changing
		limit: "10mb",
	},
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = true;

// remove alter
sequelize.sync({ alter: isTest }).then(async () => {
	httpServer.listen({ port: 8000 }, () => {
		console.log("Apollo Server on http://localhost:8000/graphql");
	});
});
