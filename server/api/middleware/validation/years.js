const { body, validationResult } = require("express-validator");
const moment = require("moment");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    const { title, start, end } = req.body;

    const momentStart = moment(start, "YYYY-MM-DD");
    const momentEnd = moment(end, "YYYY-MM-DD");

    body(title, "Title field received an invalid input")
        .isAlphanumeric().withMessage("The title can only include letters and numbers")
        .isLength({ min: 3, max: undefined }).withMessage("The title must be at least 3 characters")
        .escape();
        
    body(start, "Start date field received an invalid input")
        .exists().withMessage("Start date is a required field")
        .toDate()
        .escape();

    body(end, "End date field received an invalid input")
        .exists().withMessage("End date is a required field")
        .toDate()
        .escape();

    if(momentStart >= momentEnd) {
        return res.status(400).json({ message: "Start date must come before the end date" });
    };
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: errors.msg });
    } else {
        return next();
    };
};