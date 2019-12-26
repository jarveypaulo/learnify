import React, { Component, Fragment } from "react";
import Helmet from "react-helmet";

import { connect } from "react-redux";
import { postInvite } from "../../../../../actions/root/beta";
import { clearErrors } from "../../../../../actions/auth/errors";
import PropTypes from "prop-types";

import Header from "../../../global/organisms/Header";

import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";

import background from "./home-min.jpg";
import "../../Root.scss";

class Home extends Component {
    state = {
        name: "",
        email: "",
        message: null,
        success: null
    };

    static propTypes = {
        beta: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        postInvite: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        const { beta, error } = this.props;

        if(error !== prevProps.error) {
            if(error.id === "INVITE_ERROR") {
                this.setState({
                    message: error.message.message,
                    success: false
                });
            } else {
                this.setState({
                    message: null,
                    success: null
                });
            };
        };

        if(beta !== prevProps.beta) {
            if(beta.message) {
                this.setState({
                    message: beta.message.message,
                    success: true
                });
            } else {
                this.setState({
                    message: null,
                    success: null
                });
            };
        };
    };

    handleChange = e => {
        this.setState({ 
            [e.target.name]: e.target.value 
        });
    };

    handleReset = e => {
        e.preventDefault();

        const { clearErrors } = this.props;

        clearErrors();

        this.setState({
            name: "",
            email: "",
            message: null,
            success: null
        });        
    };

    handleSubmit = e => {
        e.preventDefault();

        const { postInvite } = this.props;
        const { name, email } = this.state;

        const beta = {
            name,
            email
        };

        // pass data to API
        postInvite(beta);

        // reset form fields
        this.setState({
            name: "",
            email: ""
        });
    };

    render() {
        const { name, email, message, success } = this.state;

        const isEnabled = name.length > 2 && email.length > 5 && regex.test(email);
    
        return (
            <Fragment>
                <Helmet>    
                    <meta name="description" content="Sign up today for Learnify's beta program"/>
                    <meta name="keywords" content="Learnify, homework, app, study app, homework app, university app, planner, study planner, highschool"/>
                    <title>Learnify</title>
                </Helmet>
                <div id="public">
                    <Header/>
                    <main className="root" role="main">
                        <img src={background} className="home-background" alt=""/>
                        <div className="home-pitch">
                            <h3>Building the Foundations for Student Success</h3>
                            <p>
                                Sign up for the beta program to have a successful school year right at your finger tips. 
                                Academic excellence has never been this simple.
                            </p>
                        </div>
                        <Form onSubmit={this.handleSubmit} className="home-form" role="form">
                            {   message && success ? (
                                <Alert color="success">{message}</Alert>
                            ):  message && !success ? (
                                <Alert color="danger">{message}</Alert>
                            ):  null }
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input 
                                    name="name" 
                                    type="text" 
                                    placeholder="Jane Doe" 
                                    value={name}
                                    onChange={this.handleChange}
                                    required
                                    />
                                { name.length === 1 ? (
                                <small className="warning">
                                    2 characters left.
                                </small>
                                ) : name.length === 2 ? (
                                <small className="warning">
                                    1 character left
                                </small>
                                ) : null } 
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input 
                                    name="email" 
                                    type="email" 
                                    placeholder="janedoe@example.com" 
                                    value={email}
                                    onChange={this.handleChange}
                                    required
                                />
                                {email.length > 5 && !regex.test(email) ? (
                                <small className="warning">
                                    Email must be a valid email address
                                </small> 
                                ) : null}
                                <small className="emailHelp form-text text-muted">We'll never share your email with anyone else. 
                                By requesting an invite you agree to our <a href="https://docs.learnify.ca/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="https://docs.learnify.ca/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</small>
                            </FormGroup>
                            <FormGroup>
                                <Button className="home-reset" type="reset" onClick={this.handleReset}>Reset Form</Button>
                                <Button className="home-submit" type="submit" disabled={!isEnabled}>Request Invite</Button>
                            </FormGroup>
                        </Form>
                    </main>
                </div>
            </Fragment>
        );
    };
};

const mapStateToProps = state => ({
    beta: state.beta,
    error: state.error
});

const mapDispatchToProps = { postInvite, clearErrors };

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const regex = /(?!.*\.{2})^([a-z\d!#$%&'*+\-=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i