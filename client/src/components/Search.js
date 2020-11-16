import React, { Component } from "react";
import { Form, Segment } from "semantic-ui-react";

import Results from "./Results.js";

import axios from "axios";

class Search extends Component {
  state = {
    body: "",
    sender: "",
    similarMatches: 0,
    exactMatches: 0,
    highestResult: 0,
    open: true,
    senderMatch: false,
  };

  setOpen = () => {
    this.setState({ open: true });
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { body, sender } = this.state;
    axios
      .post("/submit/phish", { body: body, sender: sender })
      .then((res) => {
        this.setState({ senderMatch: res.data.senderMatches });
        for (let i = 0; i < res.data.similarToUser.length; i++) {
          if (res.data.scoreToUser[i] > this.state.highestResult) {
            this.setState({
              highestResult: res.data.scoreToUser[i],
            });
            this.setState({ similarMatches: res.data.similarToUser[i] });
            this.setState({ exactMatches: res.data.exactMatchesToUser[i] });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const {
      sender,
      body,
      highestResult,
      similarMatches,
      exactMatches,
      senderMatch,
    } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.TextArea
            label="Email text"
            placeholder="Paste the body of the email you have received"
            name="body"
            value={body}
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            label="Sender"
            placeholder="Email address where it came from"
            name="sender"
            value={sender}
            onChange={this.handleChange}
          />
          <Form.Button content="Submit" />
        </Form>
        {this.state.highestResult > 0 && (
          <Results
            highestResult={highestResult}
            similarMatches={similarMatches}
            exactMatches={exactMatches}
            sender={sender}
            senderMatch={senderMatch}
            body={body}
          />
        )}
      </div>
    );
  }
}

export default Search;
