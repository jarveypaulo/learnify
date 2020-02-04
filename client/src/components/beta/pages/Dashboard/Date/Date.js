import React, { Component } from "./node_modules/react";
import Moment from "./node_modules/react-moment";
import "./Date.scss";

export default class DateDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
    
        }
    }
        
    render() {
	    return <h4><Moment format="dddd, MMMM Do">{this.props.dateToFormat}</Moment></h4>
    }
}