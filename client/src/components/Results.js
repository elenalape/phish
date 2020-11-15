import React, { Component } from "react";
import {
	Segment,
	Modal,
	Button,
	Image,
	Header,
	Label,
} from "semantic-ui-react";

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

class Results extends Component {
	state = {
		similarMatches: this.props.similarMatches,
		exactMatches: this.props.exactMatches,
		highestResult: this.props.highestResult,
		open: false,
		highestUserResult: 0,
		similarUserMatches: 0,
		exactUserMatches: 0,
		senderMatchAdmin: this.props.senderMatch,
		senderMatchUser: false,
	};

	// const [open, setOpen] = React.useState(false);

	// const [highestUserResult, setHighestUserResult] = React.useState(0);
	// const [similarUserMatches, setSimilarUserMatches] = React.useState(0);
	// const [exactUserMatches, setExactUserMatches] = React.useState(0);

	handleClick = () => {
		axios
			.post("/submit/userphish", {
				body: this.props.body,
				sender: this.props.sender,
			})
			.then((res) => {
				if (this.props.sender === res.data.senderMatches) {
					this.setState({ senderMatchUser: true });
				}

				for (let i = 0; i < res.data.similarToUser.length; i++) {
					// console.log(res.data.scoreToUser[i]);
					// console.log(highestUserResult);
					if (
						res.data.scoreToUser[i] > this.state.highestUserResult
					) {
						const score = res.data.scoreToUser[i];
						const similar = res.data.similarToUser[i];
						const exact = res.data.exactMatchesToUser[i];
						this.setState({ highestUserResult: score });
						this.setState({ similarUserMatches: similar });
						this.setState({ exactUserMatches: exact });
					}
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		let probabilityMarkup = null;
		let senderMatchMarkup = null;
		const result = `${(this.props.highestResult * 100).toFixed(2)}%`;
		const score = this.props.highestResult;
		const similarMatches = this.props.similarMatches;
		const exactMatches = this.props.exactMatches;

		if (this.state.senderMatchAdmin) {
			senderMatchMarkup = (
				<div style={{ float: "right" }}>
					<Label as="a" color="red" tag>
						{this.props.sender} has been flagged as a bad actor
						before.
					</Label>
				</div>
			);
		}

		if (score < 0.4) {
			probabilityMarkup = (
				<div>
					{senderMatchMarkup}
					<h4>
						The probability of your email being a phish is{" "}
						<span style={{ color: "green" }}>low</span>: {result}.
					</h4>
					<h5>
						According to known phish records, no significantly
						similar emails were found.
					</h5>
					<Modal
						onClose={() => this.setState({ open: false })}
						onOpen={() => this.setState({ open: true })}
						open={this.state.open}
						trigger={
							<Button primary onClick={this.handleClick}>
								Search crowdsourced database
							</Button>
						}
					>
						<Modal.Header>
							Thank you for reporting a suspicious email!
						</Modal.Header>
						<Modal.Content image>
							<Image size="medium" src={logo} wrapped />
							<Modal.Description>
								<Header color="blue">
									Your email matches another user submitted
									phish by{" "}
									{(
										this.state.highestUserResult * 100
									).toFixed(2)}
									%.
								</Header>
								<h4>
									At least {this.state.similarUserMatches}{" "}
									students have flagged a similar email as a
									phish.
								</h4>
								<h4>
									{this.state.exactUserMatches} students got
									the exact same email and thought it was a
									phish.
								</h4>
								{this.state.senderMatchUser ? (
									<h4>
										The sender has been reported as
										suspicious.
									</h4>
								) : null}
								<p>
									Thank you for making our school a safer
									place!
								</p>
							</Modal.Description>
						</Modal.Content>
					</Modal>
				</div>
			);
		} else if (score < 0.7) {
			probabilityMarkup = (
				<div>
					{senderMatchMarkup}
					<h4>
						The content of your email matches a known phishing
						scenario to a{" "}
						<span style={{ color: "pink" }}>high extent</span>:{" "}
						{result}.
					</h4>
					<h5>
						{this.props.similarMatches} people have flagged a
						similar email to be a phish.
					</h5>
				</div>
			);
		} else {
			probabilityMarkup = (
				<div>
					{senderMatchMarkup}
					<h4>
						The content of your email matches a known phishing
						scenario to a{" "}
						<span style={{ color: "red" }}>very high extent</span>:{" "}
						{result}.
					</h4>
					<h5>
						{this.props.similarMatches} people have flagged a
						similar email to be a phish and{" "}
						{this.props.exactMatches} got the exact same one!
					</h5>
				</div>
			);
		}

		return (
			<Segment color="blue" small>
				{probabilityMarkup}
			</Segment>
		);
	}
}

export default Results;
