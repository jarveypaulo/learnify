const async = require("async");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

// model
const Term = require("../models/Terms");
const Year = require("../models/Years");

const redis = require("../config/cache");
	
exports.create = (req, res) => {
	const redisKey = JSON.stringify(); // key takes the form `${_id}:terms` in production

	const saveToDb = callback => {
		// const { _id } = req.user;
		const { year, title, start, end } = req.body;

		Term.create({
			_id: ObjectId(),
			user: ObjectId("5deb33a40039c4286179c4f1"), // pull from cache in production
			year: ObjectId(year),
			title,
			date: {
				start,
				end
			}
		})
		.then(prePopulatedTerm => {
			callback(null, prePopulatedTerm);
		})
		.catch(err => {
			return res.status(500).json({
				message: err.message
			});
		});
	};

	const populatePreCache = (prePopulatedTerm, callback) => {
		Term.find({ _id: prePopulatedTerm._id })
		.populate("year", [ "title" ])
		.limit(1)
		.then(populatedTerm => {
			callback(null, populatedTerm[0]);
		})
		.catch(err => {
			return res.status(500).json({
				message: err.message
			});
		});
	};

	const cacheResults = (populatedTerm, callback) => {
		redis.del(redisKey);
		redis.setex(JSON.stringify(populatedTerm._id), 3600, JSON.stringify(populatedTerm));

		callback(null, { 
			message: "New term created",
			term
		});
	};

	async.waterfall([
		saveToDb,
		populatePreCache,
		cacheResults
	], (err, results) => {
		if(err) {
			return res.status(500).json({
				message: err.message
			});
		} else {
			return res.status(201).json(results);
		};
	});
};

exports.read = (req, res) => {
	const { yearId } = req.params;

	const redisKey = JSON.stringify();

	const checkCache = callback => {
		redis.get(redisKey, (err, cacheResults) => {
			if(err) {
				return res.status(500).json({
					message: err.message
				});
			} else if (cacheResults) {
				callback(null, JSON.parse(cacheResults));
			} else {
				callback(null);
			};	
		});
	};	

	const queryDb = (cacheResults, callback) => {
		if(cacheResults) {
			callback(null, cacheResults);
		} else {
			Term.find({ year: yearId }, {
				title: 1,
				date: 1
			})
			.populate("year", [ "title" ])
			.sort({ "date.start": -1})
			.then(terms => {
				if(terms.length === 0) {
					return res.status(404).json({
						message: "No terms were found"
					});
				} else {
					redis.setex(redisKey, 3600, JSON.stringify(terms));

					callback(null, terms);
				};
			})
			.catch(err => {
				return res.status(500).json({
					message: err.message
				});
			});
		};
	};

	async.waterfall([
		checkCache,
		queryDb
	], (err, results) => {
		if(err) {
			return res.status(500).json({
				message: err.message
			});
		} else {
			return res.status(200).json(results);
		};
	});
};

exports.edit = (req, res) => {
	const { termId } = req.params;

	const checkCache = callback => {
		redis.get(JSON.stringify(termId), (err, cacheResults) => {
			if(err) {
				return res.status(500).json({
					message: err.message
				});
			} else if(cacheResultss) {
				callback(null, JSON.parse(cacheResults));
			} else {
				callback(null);
			};
		});	
	};

	const queryDb = (cacheResults, callback) => {
		if(cacheResults) {
			callback(null, cacheResults);
		} else {
			Term.find({ _id: termId }, {
				user: 1,
				year: 1,
				title: 1,
				date: 1
			})
			.populate("year", [ "title" ])
			.limit(1)
			.then(term => {
				if(term.length === 0) {
					return res.status(404).json({
						message: "Term not found" 
					});
				} else {
					redis.setex(JSON.stringify(term[0]._id), 3600, JSON.stringify(term[0]));

					callback(null, term[0]);
				};
			})
			.catch(err => {
				if(err.kind === "ObjectId") {
					return res.status(404).json({
						message: "Term not found" 
					});
				} else {
					return res.status(500).json({
						message: err.message
					});
				};
			});
		};
	};

	const getYearOptions = (term, callback) => {
		Year.find({ 
			user: term.user,
			title: {
				$ne: term.title
			}
		}, {
			title: 1
		})
		.sort({ "date.start": -1 })
		.then(options => {
			if(options.length === 0) {
				return res.status(404).json({
					message: "Could not find your years"
				});
			} else {
				callback(null, { term, options });
			};
		})
		.catch(err =>{
			return res.status(500).json({
				message: err.message
			});
		});
	};

	async.waterfall([
		checkCache,
		queryDb,
		getYearOptions
	], (err, results) => {
		if(err) {
			return res.status(500).json({
				message: err.message
			});
		} else {
			return res.status(200).json(results);
		};
	});
};

exports.update = (req, res) => {
	const { termId } = req.params;
	const { year, title, start, end, createdAt } = req.body;

	const redisKey = JSON.stringify(); // key takes the form `${_id}:terms` in production
	
	const updateDb = callback => {
		const update = {
			year,
			title,
			date: {
				start,
				end
			},
			meta: {
				createdAt,
				updatedAt: moment().utc(moment.utc().format()).local().format("YYYY MM DD, hh:mm")
			}	
		};
	
		Term.updateOne({ _id: termId }, {
			$set: update
		})
		.then(term => {
			if(term.length === 0) {
				return res.status(404).json({
					message: "Term not found"
				});
			} else {
				callback(null, term);
			};
		})
		.catch(err => {
			if(err.kind === "ObjectId") {
				return res.status(404).json({
					message: "Term not found"
				});
			} else {
				return res.status(500).json({
					message: err.message
				});
			};
		});
	};

	const updateCache = (term, callback) => {
		redis.del(redisKey);

		redis.setex(JSON.stringify(term._id), 3600, JSON.stringify(term));

		callback(null, {
			message: "Term updated",
			term
		});
	};

	async.waterfall([
		updateDb,
		updateCache
	], (err, results) => {
		if(err) {
			return res.status(500).json({
				message: err.message
			});
		} else {
			return res.status(200).json(results);
		};
	});
};

exports.delete = (req, res) => {
	const { termId } = req.params;

	const redisKey = JSON.stringify(); // key takes the form `${_id}:terms` in production
	
	const clearCache = callback => {
		redis.del(redisKey);
		redis.del(JSON.stringify(termId));

		callback(null);
	};

	const deleteFromDb = callback => {
		Term.deleteOne({ _id: termId })
		.then(deletedTerm => {
			if(!deletedTerm) {
				return res.status(404).json({
					message: "Term not found"
				});
			} else {
				callback(null);
			};
		})
		.catch(err => {
			if(err.kind === "ObjectId" || err.name === "NotFound") {
				return res.status(404).json({
					message: "Term not found"
				});
			} else {
				return res.status(500).json({
					message: err.message
				});
			};
		});
	};

	async.parallel([
		clearCache,
		deleteFromDb
	], (err, results) => {
		if(err) {
			return res.status(500).json({
				message: err.message
			});
		} else {
			return res.status(200).json({
				message: "Term deleted"
			});
		};
	});
};