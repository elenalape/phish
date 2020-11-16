import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";
import { Container } from "semantic-ui-react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";

import axios from "axios";

axios.defaults.baseURL =
	"https://europe-west2-college-phish-api.cloudfunctions.net/api";

function App() {
	return (
		<Container>
			<Router>
				<Navbar />
				<Route exact path="/" component={Landing} />
			</Router>
		</Container>
	);
}

export default App;
