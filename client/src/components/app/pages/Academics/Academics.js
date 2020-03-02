import React, { Component } from "react";
import { Helmet } from "react-helmet";

import { connect } from "react-redux";
import { fetchYears, editYear } from "../../../../actions/app/years";
import { fetchTerms, editTerm } from "../../../../actions/app/terms";
import { fetchCourses, editCourse } from "../../../../actions/app/courses";
import { fetchClassesByCourse, editClass } from "../../../../actions/app/classes";
import PropTypes from "prop-types";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Row } from "reactstrap";

import AuthNav from "../../organisms/AuthNav";
import AppNav from "../../organisms/AppNav";
import Header from "../../organisms/Header";

/* Atoms */
import Icon from "../../atoms/Icon";

/* Organisms */
import List from "../../organisms/List";

import Loadable from "react-loadable";

import "./Academics.scss";

class Academics extends Component {
	state = {

	};

	static propTypes = {
		// isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		year: PropTypes.object.isRequired,
		term: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		classes: PropTypes.object.isRequired,
		fetchYears: PropTypes.func.isRequired,
		editYear: PropTypes.func.isRequired,
		fetchTerms: PropTypes.func.isRequired,
		editTerm: PropTypes.func.isRequired,
		fetchCourses: PropTypes.func.isRequired,
		editCourse: PropTypes.func.isRequired,
		fetchClassesByCourse: PropTypes.func.isRequired,
		editClass: PropTypes.func.isRequired
	};

	componentDidMount() {
		const { fetchYears } = this.props;
		fetchYears();
	};

	componentDidUpdate(prevProps) {
		const { error } = this.props;

		if(error !== prevProps.error) {
			if(error.id === "") {
				this.setState({ message: error.message.message });
			} else {
				this.setState({ message: null });
			};
		};
	};

	render() {
		const { } = this.state;
		const { 
			year: { years },
			term: { terms },
			course: { courses },
			classes: { classes },
			fetchTerms,
			editTerm,
			fetchCourses,
			editCourse,
			fetchClassesByCourse,
			editClass
		} = this.props;

		return (
			<>
				<Helmet>
					<meta name="description" content="User's Academics page."/>
					<meta name="keywords" content="Learnify, Academics, Years, Terms, Semester, Course, Courses, Class, Classes"/>
					<title>My Learnify | Academics</title>
				</Helmet>
				<div id="beta">
					<AuthNav/>
					<AppNav/>
					<div id="academics">
						<Row className="header">
							<Col>
								<Header header="Academics"/>
							</Col>
							<Col>
								{/* <Years/> */}
								<YearEdit/>
								<YearNew/>
							</Col>
						</Row>
						<Row className="body academics-body">
							<Col>
								<Row className="terms-header">
									<Col>
										<h4>Terms</h4>
									</Col>
									<Col>
										<TermNew/>
										<Button onClick={this}>
											<Icon icon={faEdit}/>
										</Button>
									</Col>
								</Row>
							</Col>
							<Col>
								<Row className="courses-header">
									<Col>	
										<h4>Courses</h4>
									</Col>
									<Col>
										<CourseNew/>
										<Button onClick={this}>
											<Icon icon={faEdit}/>
										</Button>
									</Col>
								</Row>
							</Col>
							<Col>
								<Row className="classes-header">
									<Col>
										<h4>Classes</h4>
									</Col>
									<Col>
										<ClassNew/>
										<Button onClick={this}>
											<Icon icon={faEdit}/>
										</Button>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row>
							<List 
								id="terms"
								class="terms-list"
								data={years.map(year => {
									return (
										<Row key={year._id} className="academics-data" onClick={fetchTerms(year._id)}>
											<Col>
												<ul>
													<li>
														<Row className="years-data">
															<Col>
																{year.title}
															</Col>
															<Col>
																{year.date.start} - {year.date.end}
															</Col>
														</Row>
														<ul>
															{terms.map(term => {
																return (
																	<Row key={term._id} className="term-data" onClick={fetchCourses(term._id)}>
																		<Col>
																			<h4>{term.title}</h4>
																		</Col>
																		<Col>
																			<p>{term.date.start}</p>
																			<p>{term.date.end}</p>
																		</Col>
																		<Col>
																			<TermEdit onClick={editTerm(_id)}/>
																		</Col>
																	</Row>
																);
															})}
														</ul>
													</li>
												</ul>
											</Col>
										</Row>
									);
								})}
								empty="There are no existing terms"
							/>
							<List 
								id="courses"
								class="courses-list"
								data={courses.map(({ _id, title, term, code, instructor }) => {
									return (
										<Row key={_id} className="course-data" onClick={fetchClassesByCourse(_id)}>
											<Col>
												<h4>{title}</h4>
												<h5>{term.title}</h5>
											</Col>
											<Col>
												<p>{code}</p>
												<p>{instructor}</p>
											</Col>
											<Col>
												<CourseEdit onClick={editCourse(_id)}/>
											</Col>
										</Row>
									);
								})}
								empty="There are no existing courses"
							/>
							<List 
								id="classes"
								class="classes-list"
								data={classes.map(({ _id, title, course, location, date }) => {
									return (
										<Row key={_id} className="class-data">
											<Col>
												<h4>{title}</h4>
												<h5>{course.title}</h5>
											</Col>
											<Col>
												<p>{date}</p>
												<p>{location}</p>
											</Col>	
											<Col>
												<ClassEdit onClick={editClass(_id)}/>
											</Col>
										</Row>
									);
								})}
								empty="There are no existing classes"
							/>
							<List/>
						</Row>
					</div>
				</div>
			</>
		);
	};
};

const YearNew = Loadable({
	loader: import(/* webpackChunkName: "YearNew" */ "../../reactors/YearNew"),
	loading: () => <div></div>,
	delay: 300
});

const YearEdit = Loadable({
	loader: import(/* webpackChunkName: "YearEdit" */ "../../reactors/YearEdit"),
	loading: () => <div></div>,
	delay: 300
});

const TermNew = Loadable({
	loader: import(/* webpackChunkName: "TermNew" */ "../../reactors/TermNew"),
	loading: () => <div></div>,
	delay: 300
});

const TermEdit = Loadable({
	loader: import(/* webpackChunkName: "TermEdit"*/ "../../reactors/TermEdit"),
	loading: () => <div></div>,
	delay: 300
});

const CourseNew = Loadable({
	loader: import(/* webpackChunkName: "CourseNew" */ "../../reactors/CourseNew"),
	loading: () => <div></div>,
	delay: 300
});

const CourseEdit = Loadable({
	loader: import(/* webpackChunkName: "CourseEdit" */ "../../reactors/CourseEdit"),
	loading: () => <div></div>,
	delay: 300
});

const ClassNew = Loadable({
	loader: import(/* webpackChunkName: "ClassNew" */ "../../reactors/ClassNew"),
	loading: () => <div></div>,
	delay: 300
});

const ClassEdit = Loadable({
	loader: import(/* webpackChunkName: "ClassEdit" */ "../../reactors/ClassEdit"),
	loading: () => <div></div>,
	delay: 300
});

const mapStateToProps = state => ({
	// isAuthenticated: state.auth.isAuthenticated,
	error: state.error,
	year: state.year,
	term: state.term,
	course: state.course,
	classes: state.classes,
});

const mapDispatchToProps = { 
	fetchYears, editYear,
	fetchTerms, editTerm,
	fetchCourses, editCourse,
	fetchClassesByCourse, editClass 
};

export default connect(mapStateToProps, mapDispatchToProps)(Academics);