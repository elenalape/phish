import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { Redirect } from "react-router";
import axios from "axios";

class FormExampleCaptureValues extends Component {
  state = {
    password: "",
    email: "",
    loggedIn: false,
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { email, password } = this.state;
    console.log(email);

    this.setState({ submittedPassword: password, submittedEmail: email });
    axios
      .post("/login", { email: email, password: password })
      .then((res) => {
        console.log(res);
        this.setState({ loggedIn: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { password, email } = this.state;

    if (this.state.loggedIn === true) {
      return <Redirect to="/ok" />;
    } else {
      return (
        <div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Input
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                placeholder="Password"
                name="password"
                value={password}
                type="password"
                onChange={this.handleChange}
              />
              <Form.Button content="Submit" />
            </Form.Group>
          </Form>
        </div>
      );
    }
  }
}

export default FormExampleCaptureValues;
