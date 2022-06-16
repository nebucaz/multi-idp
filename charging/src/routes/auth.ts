import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.use("/login", passport.authenticate("alpha"));
//passport.authenticate(config, { failureRedirect: '/', failureFlash: true })();

authRouter.use("/cb",
    passport.authenticate("alpha", { failureRedirect: "/error" }),
    (req, res) => {
       // res.redirect("/profile");
       res.send("cb");
       console.log("cb");
    }
);

authRouter.use("/profile", (req, res) => {
    //res.render("profile", { title: "Express", user: req.user });
    res.send("profile");
});

export default authRouter;
