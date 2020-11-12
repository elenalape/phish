import React from "react";
import { Segment, Modal, Button, Image, Header } from "semantic-ui-react";

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

	let probabilityMarkup = null;
	const result = `${(props.highestResult * 100).toFixed(2)}%`;
	const score = props.highestResult;
	const similarMatches = props.similarMatches;
	const exactMatches = props.exactMatches;

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
					trigger={<Button primary>Show Modal</Button>}
				>
					<Modal.Header>Select a Photo</Modal.Header>
					<Modal.Content image>
						<Image
							size="medium"
							src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
							wrapped
						/>
						<Modal.Description>
							<Header>Default Profile Image</Header>
							<p>
								We've found the following gravatar image
								associated with your e-mail address.
							</p>
							<p>Is it okay to use this photo?</p>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button color="black" onClick={() => setOpen(false)}>
							Nope
						</Button>
						<Button
							content="Yep, that's me"
							labelPosition="right"
							icon="checkmark"
							onClick={() => setOpen(false)}
							positive
						/>
					</Modal.Actions>
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
