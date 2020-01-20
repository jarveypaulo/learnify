const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validation/auth");
const controller = require("../controllers/auth");

router.get("/user", /*auth,*/ validate.user, controller.user);

router.post("/register", validate.register, controller.register);

router.post("/signin", validate.signin, controller.signin);

router.put("/verifyEmail/:token", controller.verifyEmail);

router.put("/resendEmailVerification", controller.resendEmailVerification);

router.post("/forgotPassword", controller.forgotPassword);

router.get("/changePassword/:token", controller.changePassword);

router.put("/resetPassword", controller.resetPassword);

router.delete("/signout", /*auth,*/ validate.signout, controller.signout);
  
module.exports = router;