import React from "react";
import { Segment, Modal, Button, Image, Header } from "semantic-ui-react";

import logo from "../assets/logo.png";

import axios from "axios";

// const Results = ({ result, similarMatches, exactMatches, open, setOpen }) => {
// 	return (
// 		<Modal
// 			color="blue"
// 			small
// 			open={open}
// 			closeIcon
// 			onClose={() => setOpen(false)}
// 			onOpen={() => setOpen(true)}
// 		>
// 			<Modal.Header>Results</Modal.Header>
// 			<Modal.Content>
// 				The likelihood of your email being a phish is {result}.
// 			</Modal.Content>
// 		</Modal>
// 	);
// };

const Results = (props) => {
	const [open, setOpen] = React.useState(false);

	const [highestUserResult, setHighestUserResult] = React.useState(0);
	const [similarUserMatches, setSimilarUserMatches] = React.useState(0);
	const [exactUserMatches, setExactUserMatches] = React.useState(0);

	let probabilityMarkup = null;
	const result = `${(props.highestResult * 100).toFixed(2)}%`;
	const score = props.highestResult;
	const similarMatches = props.similarMatches;
	const exactMatches = props.exactMatches;

	const handleClick = () => {
		axios
			.post("/submit/userphish", {
				body: props.body,
				sender: props.sender,
			})
			.then((res) => {
				console.log(res);
				for (let i = 0; i < res.data.similarToUser.length; i++) {
					if (res.data.scoreToUser[i] > highestUserResult) {
						setHighestUserResult(res.data.scoreToUser[i]);
						setSimilarUserMatches(res.data.similarToUser[i]);
						setExactUserMatches(res.data.exactMatchesToUser[i]);
					}
				}
				console.log("hello");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (score < 0.2) {
		probabilityMarkup = (
			<div>
				<h4>
					The likelihood of your email being a phish is{" "}
					<span style={{ color: "green" }}>very low</span>: {result}.
				</h4>
				<h5>
					According to the official records, no significantly similar
					emails were found.
				</h5>
				<Modal
					onClose={() => setOpen(false)}
					onOpen={() => setOpen(true)}
					open={open}
					trigger={
						<Button primary onClick={handleClick}>
							Search crowdsourced database
						</Button>
					}
				>
					<Modal.Header>
						Thank you for reporting the phish!
					</Modal.Header>
					<Modal.Content image>
						<Image size="medium" src={logo} wrapped />
						<Modal.Description>
							<Header color="blue">
								There is a{" "}
								{(highestUserResult * 100).toFixed(2)}% chance
								that your email is a phish.
							</Header>
							<h4>
								At least {similarUserMatches} students have
								flagged a similar email as a phish.
							</h4>
							<h4>
								{exactUserMatches} students got the exact same
								email and thought it was a phish.
							</h4>
							<p>
								Thank you for making our school a safer place!
							</p>
						</Modal.Description>
					</Modal.Content>
				</Modal>
			</div>
		);
	} else if (score < 0.7) {
		probabilityMarkup = (
			<div>
				<h4>
					The likelihood of your email being a phish is{" "}
					<span style={{ color: "pink" }}>high</span>: {result}.
				</h4>
				<h5>
					{similarMatches} people have flagged a similar email to be a
					phish.
				</h5>
			</div>
		);
	} else {
		probabilityMarkup = (
			<div>
				<h4>
					The likelihood of your email being a phish is{" "}
					<span style={{ color: "red" }}>very high</span>: {result}.
				</h4>
				<h5>
					{similarMatches} people have flagged a similar email to be a
					phish and {exactMatches} got the exact same one!
				</h5>
			</div>
		);
	}

	return (
		<Segment color="blue" small>
			{probabilityMarkup}
		</Segment>
	);
};

export default Results;
