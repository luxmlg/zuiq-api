"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const a = await queryInterface.renameColumn("Meetings", "QuizId", "quizId");
		console.log(a);
		await queryInterface.renameColumn("Meetings", "UserId", "userId");
		await queryInterface.renameColumn("Participants", "MeetingId", "meetingId");
		await queryInterface.renameColumn("Quizzes", "UserId", "userId");
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.renameColumn("Meetings", "quizId", "QuizId");
		await queryInterface.renameColumn("Meetings", "userId", "UserId");
		await queryInterface.renameColumn("Participants", "meetingId", "MeetingId");
		await queryInterface.renameColumn("Quizzes", "userId", "UserId");
	},
};
