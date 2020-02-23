import React, { Component } from "react";

import { connect } from "react-redux";
import { updateTerm, deleteTerm } from "../../../../actions/beta/terms";
import { clearErrors } from "../../../../actions/auth/errors";
import PropTypes from "prop-types";

/* Atoms */
import Icon from "../../atoms/Icon";

import { 
    Alert, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, 
    Form, FormGroup, Label, Input
} from "reactstrap";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

class TermEdit extends Component {
    state = {
        modal: false,
        _id: "",
        title: "",
        start: "",
        end: "",
        message: null
    };

    static propTypes = {
        // isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        term: PropTypes.object.isRequired,
        updateTerm: PropTypes.func.isRequired,
        deleteTerm: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };
    
    componentDidUpdate(prevProps) {
        const { error } = this.props;

        if(error !== prevProps.error) {
            this.setState({
                message: error.message.message
            });
        } else {
            this.setState({
                message: null
            });
        };
    };

    toggle = () => {
        const { clearErrors } = this.props;
        const { modal } = this.state;

        clearErrors();

        this.setState({
            modal: !modal
        });
    };

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        const { title, start, end } = this.state;
        const { updateTerm } = this.props;

        const term = {
            title,
            date: {
                start,
                end
            }
        };

        updateTerm(term);

        setTimeout(() => {
            this.toggle();
        }, 2000);
    };

    handleCancel = () => {
        this.setState({
            _id: "",
            title: "",
            start: "",
            end: "",
            message: null
        });

        this.toggle();
    };

    handleDelete = id => {
        const { deleteTerm } = this.props;

        deleteTerm(id);

        setTimeout(() => {
            this.toggle();
        }, 2000);
    };

    render() {
        const { modal, message } = this.state;
        const { 
            term: { 
                terms,
                years
            } 
        } = this.props;

        return (
            <>
                <Button onClick={this.toggle}>
                    <Icon icon={faEdit}/>
                </Button>

                <Modal isOpen={modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit Term</ModalHeader>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalBody>
                            {  message === "Term Updated" || message === "Term Deleted" ? (
                                <Alert color="success">{message}</Alert>
                            ): message ? (
                                <Alert color="danger">{message}</Alert>
                            ): null }
                            <FormGroup>
                                <Label for="year">Year</Label>
                                <Input
                                    name=""
                                    type=""
                                    value=""
                                    onChange={this.handleChange}
                                    required
                                >
                                    {/* {years.map(({ _id, title }) => {
                                        <option key={_id} value={JSON.stringify(title)}>
                                            {title}
                                        </option>
                                    })} */}
                                </Input>

                                <Label for="title">Title</Label>
                                <Input
                                    name="title"
                                    type="text"
                                    value={terms.title}
                                    onChange={this.handleChange}
                                    required
                                />

                                <Label for="start">Start Date</Label>
                                <Input
                                    name="start"
                                    type="date"
                                    value={terms.date.start}
                                    onChange={this.handleChange}
                                    required
                                />

                                <Label for="end">End Date</Label>
                                <Input
                                    name="end"
                                    type="date"
                                    value={terms.date.end}
                                    onChange={this.handleChange}
                                    required
                                />
                            </FormGroup>
                            <ModalFooter>
                                <Button type="button" onClick={this.handleDelete.bind(terms._id)}>Delete Term</Button>
                                <Button type="button" onClick={this.handleCancel}>Cancel</Button>
                                <Button type="submit">Update Term</Button>
                            </ModalFooter>
                        </ModalBody>
                    </Form>
                </Modal>
            </>
        );
    };
};

const mapStateToProps = state => ({
    // isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    term: state.term
});

const mapDispatchToProps = { updateTerm, deleteTerm, clearErrors };

export default connect(mapStateToProps, mapDispatchToProps)(TermEdit);
