import React, { Link, useState } from "react";
import { useForm } from "react-hook-form";
//import { NavLink } from "react-router-dom";
import {
  Menu,
  Container,
  Image,
  Button,
  Modal,
  Icon,
  Form,
} from "semantic-ui-react";
import AdminView from "./AdminView";
import Login from "./Login";

import logo from "../assets/logo-white.png";

import axios from "axios";

const Navbar = () => {
  const [firstOpen, setFirstOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);

  const [userData, setUserData] = useState({ email: "", password: "" });

  const handleChange = ({ target }) => {
    setUserData({ [target.name]: target.value });
  };

  // const onChangeEmail = (event) =>
  //   setUserData({ ...userData, email: event.target.value });
  // const onChangePassword = (event) =>
  //   setUserData({ ...userData, password: event.target.value });

  const closeFirstUponSecond = (userData) => {
    console.log(userData);
    // axios
    //   .post("/login", userData)
    //   .then((res) => {
    //     console.log(res);
    //     setSecondOpen(true);
    //     setFirstOpen(false);
    //     // history.push("/");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <Menu fixed="top" inverted borderless>
      <Container>
        <Menu.Item as="a" header disabled>
          <Image size="small" src={logo} style={{ marginRight: "1.5em" }} />
        </Menu.Item>
        <Menu.Item as="a" position="right" disabled>
          <Button onClick={() => setFirstOpen(true)}>Admin</Button>

          <Modal
            onClose={() => setFirstOpen(false)}
            onOpen={() => setFirstOpen(true)}
            open={firstOpen}
          >
            <Modal.Header>Admin sign in</Modal.Header>
            <Modal.Content>
              <Login />
            </Modal.Content>
            <Modal.Actions>
              <Button
                type="submit"
                onClick={() => closeFirstUponSecond()}
                primary
              >
                Proceed <Icon name="right chevron" />
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => setSecondOpen(false)}
            open={secondOpen}
            size="small"
          >
            <Modal.Header>Modal #2</Modal.Header>
            <Modal.Content>
              <p>That's everything!</p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                icon="check"
                content="All Done"
                onClick={() => setSecondOpen(false)}
              />
            </Modal.Actions>
          </Modal>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default Navbar;
