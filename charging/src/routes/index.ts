import { Router } from "express";
import authRouter from "./auth.js";

const routes = Router();

routes.use("/auth", authRouter);

routes.get("/error", (req, res) => {
    res.send("We have a problem");
});

routes.get("/logout", (req, res) => {
    req.logout({}, (err) => { console.log("destroy"); });
    req.session.destroy((err) => { console.log("destroy"); });
    res.redirect("/");
});

export default routes;
