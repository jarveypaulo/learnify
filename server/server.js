/* --- Dependencies --- */
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");

/* --- Configurations --- */
const app = express();
const host = process.env.HOST || "http://localhost";
const port = process.env.PORT;
const env = process.env.NODE_ENV || "development";
const reqLimit = rateLimit({
  max: 100,
  windowMs: 60 * 1000,
  message: "Too many requests made from this IP, please try again in 1 minute",
});
require("./config/db");

/* --- Middleware --- */
// app.use(helmet());
app.use(cors());
app.use(express.json()); // add limit in production
// app.use(xss());
// app.use(mongoSanitize);
// app.use(reqLimit);
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../client/build")));
// app.use(compression());
logger((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

/* --- Routes --- */
/* Beta  */
app.use("/api/v1", require("./api/routes/auth"));
app.use("/api/v1/errors", require("./api/routes/errors"));
app.use("/api/v1", require("./api/routes/users"));

app.use("/api/v1/years", require("./api/routes/years"));
app.use("/api/v1", require("./api/routes/terms"));
app.use("/api/v1", require("./api/routes/courses"));
app.use("/api/v1", require("./api/routes/classes"));
app.use("/api/v1", require("./api/routes/assessments"));
app.use("/api/v1", require("./api/routes/tasks"));
app.use("/api/v1/bugs", require("./api/routes/bugs"));
app.use("/api/v1/feedback", require("./api/routes/feedback"));

app.use("/api/v1/geodata", require("./api/routes/geodata"));

app.use("/api/v1", require("./api/routes/search"));

/* Cron */
app.use("/cron/v1/stats", require("./cron/routes/stats"));

/* Root */
app.use("", require("./api/routes/root"));

/* Team */
app.use("", require("./api/routes/team"));

/* Fetch Client Side Rendering */
app.get("*", (req, res) => {
  res.set("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

/* --- Bootup --- */
app.listen(port, () => console.log(`${env} Server running at ${host}:${port}/`));

module.exports = app;