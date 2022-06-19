import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.use("/login/alpha", passport.authenticate("alpha"));
//passport.authenticate(config, { failureRedirect: '/', failureFlash: true })();

authRouter.use("/alpha/cb", (req, res, next) => {
    passport.authenticate("alpha", {
        failureRedirect: "/error",
        successRedirect: "/sign/id"})(req, res, next);
});

/*
https://auth0.com/blog/create-a-simple-and-secure-node-express-app/

router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});
*/

        /*,
    (req, res, next);
     => {
       // res.redirect("/profile");
       // redirect to where we came from..
       res.send("alpha cb");
       console.log("cb");
    }
    */

authRouter.use("/profile", (req, res) => {
    //res.render("profile", { title: "Express", user: req.user });
    res.send("profile");
});

export default authRouter;
