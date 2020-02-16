const async = require("async");
const moment = require("moment");

const Year = require("../models/Years");
const ObjectId = require("mongodb").ObjectId;

exports.create = (req, res) => {
	// const { _id } = req.user; // prod after auth
	const { title, start, end } = req.body;

	Year.create({
		_id: ObjectId(),
		user: ObjectId("5deb33a40039c4286179c4f1"), // get from cookie in production
		title,
		date: {
			start,
			end
		}
	})
	.then(year => {
		return res.status(201).json(year);
	})
	.catch(err => {
		return res.status(500).json({
			message: err.message
		});
	});
};

exports.read = (req, res) => {
	// const { _id } = req.user; // prod

	Year.find({ user: ObjectId("5deb33a40039c4286179c4f1") }, {
		_id: 1,
		title: 1,
		date: 1,
	})
	.sort({ "date.start": -1 })
	.then(years => {
		if(years.length === 0) {
			return res.status(404).json({
				message: "No years were found"
			});
		} else {
			return res.status(200).json(years);
		};
	})
	.catch(err => {
		return res.status(500).json({
			message: err.message
		});
	});
	
};

exports.edit = (req, res) => {
	const { yearId } = req.params;
		
	Year.find({ _id: yearId }, {
		_id: 1,
		title: 1,
		date: 1,
		meta: 1
	})
	.limit(1)
	.then(year => {
		if(year.length === 0) {
			return res.status(404).json({
				message: "Year not found"
			});
		} else {
			return res.status(200).json(year[0]);
		};
	})
	.catch(err => {
		if(err.kind === "ObjectId") {
			return res.status(404).json({
				message: "Year not found"
			});
		} else {
			return res.status(500).json({
				message: err.message
			});
		};
	});
};

exports.update = (req, res) => {
	// const { _id } = req.user; 
	const _id = ObjectId("5deb33a40039c4286179c4f1"); // testing

	const { yearId } = req.params;
	const { title, start, end, createdAt } = req.body;

	Year.updateOne({ _id: yearId }, {
		$set: {
			title,
			date: {
				start,
				end
			},
			meta: {
				createdAt,
				updatedAt: moment().utc(moment.utc().format()).local().format("YYYY MM DD, hh:mm")
			}
		}
	})
	.then(year => {
		if(year.length === 0) {
			return res.status(404).json({
				message: "Year not found"
			});
		} else {
			return res.status(200).json(year);
		};
	})
	.catch(err => {
		if(err.kind === "ObjectId") {
			return res.status(404).json({
				message: "Year not found"
			});
		} else {
			return res.status(500).json({
				message: err.message
			});
		};
	});
};

exports.delete = (req, res) => {
	const { yearId } = req.params;

	Year.deleteOne({ _id: yearId })
	.then(year => {
		if(!year) {
			return res.status(404).json({
				message: "Year not found"
			});
		} else {
			return callback(null);
		};
	})
	.catch(err => {
		if(err.kind === "ObjectId" || err.name === "NotFound") {
			return res.status(404).json({
				message: "The server was unable to find the selected academic year"
			});
		} else {
			return res.status(500).json({
				message: err.message
			});
		};
	});
};