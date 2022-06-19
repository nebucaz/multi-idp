import { Router } from "express";
import authRouter from "./auth.js";
import signRouter from "./sign.js";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/sign", signRouter);

routes.get("/error", (req, res) => {
    res.send("We have a problem");
});

// passport suggests post/delete for logout...
routes.get("/logout", (req, res, next) => {
    req.logout({}, (err) => { console.log(err); next(err); });
    //req.session.destroy((err) => { console.log("session destroy"); next(err)});

    /*
    let returnTo = req.protocol + "://" + req.hostname;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo =
      process.env.NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }
  */

    res.redirect("/");
});

export default routes;
