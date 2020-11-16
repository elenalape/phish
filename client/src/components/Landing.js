import React, { Link } from "react";
//import { NavLink } from "react-router-dom";
import { Grid, Container, Image, Button } from "semantic-ui-react";
import Search from "./Search";

import logo from "../assets/logo-square.png";

const Landing = () => {
	return (
		<Container>
			<Grid centered columns={3}>
				<Grid.Row style={{ paddingTop: "5em" }}>
					<div
						style={{
							alignItems: "flex-start",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Image size="medium" src={logo} />
					</div>
				</Grid.Row>
			</Grid>
			<Search style={{ marginBottom: "40px" }} />
		</Container>
	);
};

export default Landing;
