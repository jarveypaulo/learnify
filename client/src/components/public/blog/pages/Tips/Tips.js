import React, { Component, Fragment } from "react";
import Helmet from "react-helmet";

import Header from "../../../global/organisms/Header";
import Footer from "../../../global/organisms/Footer";

import "./Tips.scss";

export default class Tips extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Learnify | Blog</title>
                </Helmet>
                <div id="public">
                    <Header/>
                    <main className="blog" role="main">

                    </main>
                    <Footer/>
                </div>
            </Fragment>
        );
    };
};