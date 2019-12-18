import React, { Component, Fragment } from "react";
import Helmet from "react-helmet";

import Nav from "../../organisms/Nav/Nav";
import Footer from "../../organisms/Footer";

import "./History.scss";

export default class History extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Learnify | Blog</title>
                </Helmet>
                <Nav/>
                <main>

                </main>
                <Footer/>
            </Fragment>
        );
    };
};