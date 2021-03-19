import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

import { createParticipantToken } from "./participant";

export default {
	Query: {},

	Mutation: {
		sendCodeToParticipant: async (parent, { email }, { models, secret }) => {
			const getRandomInt = (min, max) => {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};

			const generateCode = () => {
				const digitCount = 4;
				let finalCode = "";

				for (let i = 0; i < digitCount; i++) {
					finalCode += getRandomInt(0, 9);
				}

				return finalCode;
			};

			const generatedCode = generateCode();

			try {
				await models.Verification.destroy({ where: { email } });

				const createdVerification = await models.Verification.create({
					id: uuidv4(),
					email: email,
					code: generatedCode,
				});

				if (!createdVerification) {
					return {
						success: false,
						message: "Could not create verification record",
					};
				}

				let transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: process.env.INVITATION_EMAIL,
						pass: process.env.INVITATION_EMAIL_PASSWORD,
					},
				});

				let mailOptions = {
					from: "zuiq.invitation@gmail.com",
					to: email,
					subject: "Zuiq - Participant verification",
					text: `Verification code : ${generatedCode}`,
				};

				transporter.sendMail(mailOptions, (err, data) => {
					if (err) {
						console.log(err);
					}
				});

				return {
					success: true,
					message: "Successfully sent verification code to participant",
				};
			} catch (error) {
				console.log(error);
			}
		},
		verifyParticipantCode: async (
			parent,
			{ email, name, code, meetingToken },
			{ models, secret },
		) => {
			try {
				const foundVerification = await models.Verification.findOne({
					where: { email },
					order: [["createdAt", "DESC"]],
				});

				if (!foundVerification) {
					return {
						success: false,
						message: "Could not find verification record",
					};
				}

				if (foundVerification.code === code) {
					const urlToken = jwt.verify(meetingToken, secret);

					const participant = await models.Participant.create({
						id: uuidv4(),
						name,
						MeetingId: urlToken.id,
					});

					const participantToken = createParticipantToken(participant, secret, "30m");

					return {
						success: true,
						message: "Participant verification code is correct",
						token: participantToken,
					};
				} else {
					return {
						success: false,
						message: "Participant verification code is incorrect",
						token: null,
					};
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
};
