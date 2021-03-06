const async = require("async");
const moment = require("moment");
const { ObjectId } = require("mongodb");

// models
const Course = require("../models/Courses");
const Assessment = require("../models/Assessments");

exports.create = (req, res) => {
    const { course, title, type, start, end, location, weight, score } = req.body;

    const matchTerm = callback => {
        Course.find({ _id: course }, {
            _id: 0,
            term: 1
        })
        .limit(1)
        .then(term => {
            if(!term) {
                return res.status(404).json({ message: "Term not found" });
            } else {
                return callback(null, term[0].term);
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };

    const createAssessment = (term, callback) => {
        Assessment.create({
            _id: ObjectId(),
            term,
            course,
            title,
            type,
            date: {
                start: moment(start, "YYYY-MM-DD, hh:mm"),
                end: (end ? moment(end, "YYYY-MM-DD, hh:mm"): null),
            },
            location,
            grade: {
                weight,
                score
            }
        })
        .then(assessment => {
            return callback(null, assessment);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ message: err.message });
        });
    };

    async.waterfall([ matchTerm, createAssessment ], (err, results) => {
        if(err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(201).json(results);
        };
    });
};

exports.read = (req, res) => {
    const { term } = req.params;
    const { limit, past } = req.query;

    if(limit) {
        Assessment.find({ 
            term,
            "date.start": {
                $gt: moment().startOf("day"),
                $lt: moment().endOf("day").add(7, "days")
            }
        }, {
            _id: 1,
            course: 1,
            title: 1,
            type: 1,
            date: 1,
            location: 1
        })
        .populate("course", [ "title" ])
        .sort({ "date.start": 1 })
        .then(assessments => {
            if(!assessments) {
                return res.status(404).json({ message: "Assessments not found" });
            } else {
                return res.status(200).json(assessments);
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    } else if (past) {
        Assessment.find({ 
            term: term,
            "date.start": {
                $lt: moment()
            } 
        }, {
            _id: 1,
            course: 1,
            title: 1,
            type: 1,
            date: 1,
            location: 1
        })
        .populate("course", [ "title" ])
        .sort({ "date.start": 1 })
        .then(assessments => {
            if(!assessments) {
                return res.status(404).json({ message: err.message });
            } else {
                return res.status(200).json(assessments);
            };  
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    } else {
        Assessment.find({ 
            term: term,
            "date.start": {
                $gt: moment()
            } 
        }, {
            _id: 1,
            course: 1,
            title: 1,
            type: 1,
            date: 1,
            location: 1
        })
        .populate("course", [ "title" ])
        .sort({ "date.start": 1 })
        .then(assessments => {
            if(!assessments) {
                return res.status(404).json({ message: "Assessments not found" });
            } else {
                return res.status(200).json(assessments);
            };  
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };  
};

exports.filter = (req, res) => {
    const { course } = req.params;
    const { past } = req.query;

    if(past) {
        Assessment.find({ 
            course,
            "date.start": {
                $lt: moment()
            }
        }, {
            _id: 1,
            course: 1,
            title: 1,
            type: 1,
            date: 1,
            location: 1
        })
        .populate("course", [ "title" ])
        .sort({ "date.start": 1 })
        .then(assessments => {
            if(!assessments) {
                return res.status(404).json({ message: "Assessments not found" });
            } else {
                return res.status(200).json(assessments);
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    } else {
        Assessment.find({ 
            course,
            "date.start": {
                $gte: moment()
            }
        }, {
            _id: 1,
            course: 1,
            title: 1,
            type: 1,
            date: 1,
            location: 1
        })
        .populate("course", [ "title" ])
        .sort({ "date.start": 1 })
        .then(assessments => {
            if(!assessments) {
                return res.status(404).json({ message: "Assessments not found" });
            } else {
                return res.status(200).json(assessments);
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };
};

exports.edit = (req, res) => {
    const { _id } = req.params;

    const getAssessment = callback => {
        Assessment.find({ _id }, {
            course: 1,
            title: 1,
            type: 1,
            date: 1,
            location: 1,
            grade: 1
        })
        .populate("course", [ "title", "term" ])
        .limit(1)
        .then(assessment => {
            if(!assessment) {
                return res.status(404).json({ message: "Assessment not found" });
            } else {
                return callback(null, assessment[0]);
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };

    const fetchCourseOptions = (assessment, callback) => {
        Course.find({ 
            term: assessment.course.term,
            title: {
                $ne: assessment.course.title
            }
        }, {
            title: 1
        })
        .sort({ title: 1 })
        .then(options => {
            if(!options) {
                return res.status(404).json({ message: "Course options not found" });
            } else {
                return callback(null, { assessment, options });
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };

    async.waterfall([ getAssessment, fetchCourseOptions ], (err, results) => {
        if(err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(results);
        };
    });    
};

exports.patch = (req, res) => {
    const { _id } = req.params;

    const getStatus = callback => {
        Assessment.find({ _id }, {
            _id: 0,
            completed: 1
        })
        .then(status => {
            if(!status) {
                return callback(null, { status: false});
            } else {
                return callback(null, { status: true });
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };

    const toggleStatus = (status, callback) => {
        if(!status) {
            Assessment.updateOne({ _id: assessmentId }, {
                $set: {
                    completed: false
                }
            })
            .then(() => {
                return callback(null, { message: "Changing assessment to complete in " }); 
            })
            .catch(err => {
                return res.status(500).json({ message: err.message });
            });
        } else {
            Assessment.updateOne({ _id: assessmentId }, {
                $set: {
                    completed: true
                }
            })
            .then(() => {
                return callback(null, { message: "Changing assessment to incomplete in " }); 
            })
            .catch(err => {
                return res.status(500).json({ message: err.message });
            });
        };
    };

    async.waterfall([ getStatus, toggleStatus ], (err, results) => {
        if(err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(results);
        };
    });
};

exports.update = (req, res) => {
    const { _id } = req.params;
    const { course, title, type, start, end, location, weight, score } = req.body;

    const matchTerm = callback => {
        Course.find({ _id: course }, {
            term: 1,
            _id: 0
        })
        .limit(1)
        .then(term => {
            if(!term) {
                return res.status(404).json({ message: "Terms not found" });
            } else {
                return callback(null, term[0].term);
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };

    const updateAssessment = (term, callback) => {
        Assessment.updateOne({ _id }, {
            $set: {
                term,
                course,
                title,
                type,
                date: {
                    start: moment(start, "YYYY-MM-DD, hh:mm"),
                    end: (end ? moment(end, "YYYY-MM-DD, hh:mm"): null)
                }, 
                location,
                grade: {
                    weight,
                    score
                }
            }
        })
        .then(assessment => {     
            if(assessment.n === 1) {
                return callback(null, { message: "Assessment updated" });
            } else {
                return res.status(404).json({ message: "Assessment not found" });
            };
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
    };

    async.waterfall([ matchTerm, updateAssessment ], (err, results) => {
        if(err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(results);
        };
    });
};

exports.delete = (req, res) => {
    const { _id } = req.params;

    Assessment.deleteOne({ _id })
    .then(assessment => {
        if(assessment.deletedCount === 1) {
            return res.status(200).json({ message: "Assessment deleted" });
        } else {
            return res.status(404).json({ message: "Assessment not found" });
        };
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
};