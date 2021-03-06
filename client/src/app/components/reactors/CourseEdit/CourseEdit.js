import React, { Component } from "react";

import { connect } from "react-redux";
import { updateCourse, deleteCourse } from "../../../actions/data/courses";
import { clearErrors } from "../../../actions/auth/errors";
import PropTypes from "prop-types";

import Icon from "../../atoms/Icon";

import { 
    Alert, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, 
    Row, Col,
    Form, FormGroup, Label, Input
} from "reactstrap";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

class CourseEdit extends Component {
    state = {
        isOpen: false,
        _id: "", 
        term: {},
        code: "",
        title: "",
        credit: 0,
        instructor: "",
        theme: "",
        terms: [],
        message: null
    };
    
    static propTypes = {
        error: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
        updateCourse: PropTypes.func.isRequired,
        deleteCourse: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { 
            courses,
            terms
        } = this.props.course;

        this.setState({
            _id: courses._id,
            term: courses.term,
            code: courses.code,
            title: courses.title,
            credit: courses.credit,
            instructor: courses.instructor,
            theme: courses.theme,
            terms
        });
    };

    componentDidUpdate(prevProps) {
        const { error } = this.props;

        if(error !== prevProps.error) {
            if(error._id === "COURSES_ERROR") {
                this.setState({ message: error.message.message });
            } else {
                this.setState({ message: null });
            };
        };
    };

    toggle = () => {
        const { clearErrors } = this.props;
        const { isOpen } = this.state;

        clearErrors();

        this.setState({ isOpen: !isOpen });
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleCancel = () => {
        this.setState({
            _id: "",
            term: {},
            code: "",
            title: "",
            credit: 0,
            instructor: "",
            theme: "",
            terms: [],
            message: null
        });

        this.toggle();
    };

    handleDelete = id => {
        const { deleteCourse } = this.props;

        deleteCourse(id);

        this.toggle();
    };

    handleSubmit = e => {
        e.preventDefault();

        const { updateCourse } = this.props;
        const { _id, code, term, title, credit, instructor, theme } = this.state;
        
        const course = {
            code, 
            term, 
            title, 
            credit, 
            instructor, 
            theme
        };

        updateCourse(_id, course);
    };

    render() {
        const { isOpen, _id, code, term, title, credit, instructor, theme, terms, message } = this.state;

        const isEnabled = code && term && title && credit && theme;

        return (
            <>
                <Button onClick={this.toggle}>
                    <Icon icon={faEdit}/>
                </Button>

                <Modal isOpen={isOpen} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit Course</ModalHeader>
                    <Form onSubmit={this.handleSubmit} className="">
                        <ModalBody>  
                            {  message ? <Alert color="danger">{message}</Alert> : null }
                            <FormGroup>
                                <Row>
                                    <Col>
                                        <Label for="code">Code</Label>
                                        <Input
                                            name="code"
                                            type="text"
                                            value={code}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Col>
                                    <Col>
                                        <Label for="term">Term</Label>
                                        <Input
                                            name="term"
                                            type="select"
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option key={term._id} value={JSON.stringify(term.title)} selected="selected">
                                                {term.title}
                                            </option>
                                            {terms.map(({ _id, title }) => {
                                                return (
                                                    <option key={_id} value={JSON.stringify(title)}>
                                                        {title}
                                                    </option>
                                                );
                                            })}
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col>
                                        <Label for="title">Title</Label>
                                        <Input
                                            name="title"
                                            type="text"
                                            value={title}
                                            onChange={this.handleChange}
                                            required
                                        />  
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="" sm="" md="" lg="" xl="">
                                        <Label for="credit">Credit</Label>
                                        <Input
                                            name="credit"
                                            type="number"
                                            value={credit}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Col>
                                    <Col xs="" sm="" md="" lg="" xl="">
                                        <Label for="instructor">Instructor</Label>
                                        <Input
                                            name="instructor"
                                            type="text"
                                            value={instructor}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col>
                                        <Label for="theme">Theme</Label>
                                        <Input
                                            name="theme"
                                            type="color"
                                            value={theme}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <ModalFooter>
                                <Button type="button" onClick={this.handleDelete(_id)}>Delete Course</Button>
                                <Button type="button" onClick={this.handleCancel}>Cancel</Button>
                                <Button type="submit" disabled={!isEnabled}>Update Course</Button>
                            </ModalFooter>
                        </ModalBody>
                    </Form>
                </Modal>  
            </>  
        );
    };
};

const mapStateToProps = state => ({
    error: state.error,
    course: state.course
});

const mapDispatchToProps = { updateCourse, deleteCourse, clearErrors };

export default connect(mapStateToProps, mapDispatchToProps)(CourseEdit);

