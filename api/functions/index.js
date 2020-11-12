const functions = require("firebase-functions");
const FBAuth = require("./util/fbAuth");

const config = require("./util/config");
const firebase = require("firebase");
firebase.initializeApp(config);
const { admin, db } = require("./util/admin");

const express = require("express");
const app = express();

const stringSimilarity = require("string-similarity");

const {
	validateSignupData,
	validateLoginData,
	reduceUserDetails,
} = require("./util/validators");

// Log user in
app.post("/login", (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password,
	};

	const { valid, errors } = validateLoginData(user);

	if (!valid) return res.status(400).json(errors);

	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			return res.json({ token });
		})
		.catch((err) => {
			console.error(err);
			return res.status(403).json({ general: "Incorrect login details" });
		});
});

//return similarity score
app.post("/submit/phish", (req, res) => {
	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({ body: "Body must not be empty" });
	}
	//create obejct from what person submits
	const userSubmission = {
		body: req.body.body,
		sender: req.body.sender,
	};
	// first we get all the emails
	// get their ids
	// concat subject and body
	db.collection("emailData")
		.get()
		.then((data) => {
			let emailData = [];
			data.forEach((doc) => {
				emailData.push({
					id: doc.id,
					emailBody: doc.data().body,
					exactMatches: doc.data().exactMatches,
					similarTo: doc.data().similarTo,
				});
			});

			let matchesScores = [];
			let userResponse = {
				similarToUser: [],
				exactMatchesToUser: [],
				scoreToUser: [],
			};

			emailData.forEach((email) => {
				const score = stringSimilarity.compareTwoStrings(
					userSubmission.body,
					email.emailBody
				);

				if (score > 0.85) {
					const newExactMatches = email.exactMatches + 1;
					const newSimilarTo = email.similarTo + 1;
					userResponse.similarToUser.push(newSimilarTo);
					userResponse.exactMatchesToUser.push(newExactMatches);
					userResponse.scoreToUser.push(score);
					db.doc(`/emailData/${email.id}`)
						.get()
						.then(() => {
							return db.doc(`/emailData/${email.id}`).update({
								exactMatches: newExactMatches,
								similarTo: newSimilarTo,
							});
						})
						.catch((err) => {
							console.error(err);
							return res.status(500).json({ error: err.code });
						});
				} else if (score > 0.4) {
					const newSimilarTo = email.similarTo + 1;
					userResponse.similarToUser.push(newSimilarTo);
					userResponse.exactMatchesToUser.push(email.exactMatches);
					userResponse.scoreToUser.push(score);
					db.doc(`/emailData/${email.id}`)
						.get()
						.then(() => {
							return db.doc(`/emailData/${email.id}`).update({
								similarTo: newSimilarTo,
							});
						})
						.catch((err) => {
							console.error(err);
							return res.status(500).json({ error: err.code });
						});
				} else {
					userResponse.similarToUser.push(0);
					userResponse.exactMatchesToUser.push(0);
					userResponse.scoreToUser.push(score);
				}

				matchesScores.push(score);
			});

			return res.json(userResponse);
		})
		.catch((err) => {
			res.status(500).json({ error: "Something went wrong" });
			console.error(err);
		});
});

// ok so if the user doesn't get any matches from the official db
// they can check it against what others have submitted
// if it's an unseen thing, add it to the user curated database
app.post("/submit/userphish", (req, res) => {
	//create obejct from what person submits
	const userSubmission = {
		body: req.body.body,
		sender: req.body.sender,
	};

	// first we get all the emails
	// USER SUBMITTED ONES
	// get their ids
	// if similarity score turns out to be quite low, we want to add it to the dabatase
	db.collection("submittedEmailData")
		.get()
		.then((data) => {
			let emailData = [];
			data.forEach((doc) => {
				emailData.push({
					id: doc.id,
					emailBody: doc.data().body,
					exactMatches: doc.data().exactMatches,
					similarTo: doc.data().similarTo,
				});
			});

			let matchesScores = [];
			let userResponse = {
				similarToUser: [],
				exactMatchesToUser: [],
				scoreToUser: [],
			};

			emailData.forEach((email) => {
				const score = stringSimilarity.compareTwoStrings(
					userSubmission.body,
					email.emailBody
				);

				if (score > 0.85) {
					const newExactMatches = email.exactMatches + 1;
					const newSimilarTo = email.similarTo + 1;
					userResponse.similarToUser.push(newSimilarTo);
					userResponse.exactMatchesToUser.push(newExactMatches);
					userResponse.scoreToUser.push(score);
					db.doc(`/emailData/${email.id}`)
						.get()
						.then(() => {
							return db
								.doc(`/submittedEmailData/${email.id}`)
								.update({
									exactMatches: newExactMatches,
									similarTo: newSimilarTo,
								});
						})
						.catch((err) => {
							console.error(err);
							return res.status(500).json({ error: err.code });
						});
				} else if (score > 0.4) {
					const newSimilarTo = email.similarTo + 1;
					userResponse.similarToUser.push(newSimilarTo);
					userResponse.exactMatchesToUser.push(email.exactMatches);
					userResponse.scoreToUser.push(score);
					db.doc(`/emailData/${email.id}`)
						.get()
						.then(() => {
							return db
								.doc(`/submittedEmailData/${email.id}`)
								.update({
									similarTo: newSimilarTo,
								});
						})
						.catch((err) => {
							console.error(err);
							return res.status(500).json({ error: err.code });
						});
				} else {
					db.collection("submittedEmailData")
						.add({
							body: userSubmission.body,
							sender: userSubmission.sender,
							exactMatches: 1,
							similarTo: 1,
						})
						.then(() => {
							userResponse.similarToUser.push(0);
							userResponse.exactMatchesToUser.push(0);
							userResponse.scoreToUser.push(score);
						})
						.catch((err) => {
							console.error(err);
						});
				}

				matchesScores.push(score);
			});

			return res.json(userResponse);
		})
		.catch((err) => {
			res.status(500).json({ error: "Something went wrong" });
			console.error(err);
		});
});

exports.api = functions.region("europe-west2").https.onRequest(app);
