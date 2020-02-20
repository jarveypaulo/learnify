const router = require("express").Router();
const auth = require("../middleware/auth");
const validation = require("../middleware/validation/classes");
const controller = require("../controllers/classes");

router.post("/classes", /*auth,*/ validation, controller.create);

router.get("/terms/:termId/classes?current&limit", /*auth,*/ controller.read);

router.get("/courses/:courseId/classes?current", /*auth,*/ controller.filter);

router.get("/classes/:classId", /*auth,*/ controller.edit);

router.put("/classes/:classId", /*auth,*/ validation, controller.delete);

router.delete("/classes/:classId", /*auth,*/ controller.delete);

module.exports = router;