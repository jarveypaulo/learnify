import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
// import ""./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

const Index = () => <App/>

render (
	<Router>
		<Index />
	</Router>,
	document.querySelector("#blog")
);

serviceWorker.register();


