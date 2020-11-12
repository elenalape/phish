import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";
import { Container } from "semantic-ui-react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Mockup from "./components/Mockup";

function App() {
	return (
		<Container>
			<Router>
				<Navbar />
				<Route exact path="/" component={Landing} />
				<Route exact path="/ok" component={Mockup} />
			</Router>
		</Container>
	);
}

export default App;
