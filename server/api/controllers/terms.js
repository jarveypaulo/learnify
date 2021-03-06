const async = require("async");
const moment = require("moment");
const { ObjectId } = require("mongodb");

// model
const Term = require("../models/Terms");
const Year = require("../models/Years");
	
exports.create = (req, res) => {
	const { year, title, start, end } = req.body;

	Term.create({
		_id: ObjectId(),
		year,
		title,
		date: {
			start: moment(start, "YYYY-MM-DD"),
			end: moment(end, "YYYY-MM-DD"),
		}
	})
	.then(term => {
		return res.status(201).json({
			term,
			message: "Term created"
		});
	})	
	.catch(err => {
		return res.status(500).json({ message: err.message });
	});
};

exports.read = (req, res) => {
	const { year } = req.params;
	const { setActiveTerm } = req.query;

	if(setActiveTerm) {
		Term.find({
			year,
			"date.start": {
				$lt: moment()
			},
			"date.end": {
				$gt: moment()
			}
		}, {
			_id: 1,
			title: 1
		})
		.limit(1)
		.then(term => {
			if(!term) {
				return res.status(404).json({ message: "Term not found" });
			} else {
				return res.status(200).json(term[0]);
			};
		})
		.catch(err => {
			return res.status(500).json({ message: err.message });
		});
	} else {
		Term.find({ year })
		.sort({ "date.start": -1 }) 
		.then(terms => {
			if(!terms) {
				return res.status(404).json({ message: "No terms found" });
			} else {
				return res.status(200).json(terms);
			};
		})
		.catch(err => {
			return res.status(500).json({ message: err.message });
		});
	};
};

exports.edit = (req, res) => {
	// const { _id } = req.user; 
	const _id = ObjectId("5deb33a40039c4286179c4f1"); // testing

	const getTerm = callback => {
		Term.find({ _id: req.params._id }) // use req.params._id
		.populate("year", [ "title" ])
		.limit(1)
		.then(term => {
			if(!terms) {
				return res.status(404).json({ message: "Term not found" });
			} else {
				return callback(null, term[0]);
			};
		})
		.catch(err => {
			if(err.kind === "ObjectId") {
				return res.status(404).json({ message: "Term not found" });
			} else {
				return res.status(500).json({ message: err.message });
			};
		});
	};

	const fetchYearOptions = (term, callback) => {
		Year.find({ 
			user: _id,
			title: {
				$ne: term.year.title
			}
		}, {
			_id: 1,
			title: 1
		})
		.sort({ "date.start": -1 })
		.then(options => {
			if(!options) {
				return res.status(404).json({ message: "Years not found" });
			} else {
				return callback(null, { term, options });
			};
		})
		.catch(err => {
			return res.status(500).json({ message: err.message });
		});
	};

	async.waterfall([
		getTerm,
		fetchYearOptions
	], (err, results) => {
		if(err) {
			return res.status(500).json({ message: err.message });
		} else {
			return res.status(200).json(results);
		};
	});
};

exports.update = (req, res) => {
	const { _id } = req.params;
	const { year, title, start, end } = req.body;

	Term.findOneandUpdate({ _id }, {
		$set: {
			year,
			title,
			date: {
				start: moment(start, "YYYY-MM-DD"),
				end: moment(end, "YYYY-MM-DD"),
			}
		}
	})
	.then(term => {
		if(!term) {
			return res.status(404).json({ message: "Term not found" });
		} else {
			return res.status(200).json({ 
				term,
				message: "Term updated" 
			});
		};
	})
	.catch(err => {
		if(err.kind === "ObjectId") {
			return res.status(404).json({ message: "Term not found" });
		} else {
			return res.status(500).json({ message: err.message });
		};
	});
	
};

exports.delete = (req, res) => {
	const { _id } = req.params;

	Term.findOneAndDelete({ _id })
	.then(term => {
		if(!term) {
			return res.status(404).json({ message: "Term not found" });
		} else {
			return res.status(200).json({ message: "Term deleted" });
		};
	})
	.catch(err => {
		if(err.kind === "ObjectId" || err.name === "NotFound") {
			return res.status(404).json({ message: "Term not found" });
		} else {
			return res.status(500).json({ message: err.message });
		};
	});
};