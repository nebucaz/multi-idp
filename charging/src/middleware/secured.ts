import { RequestHandler } from 'express'

const secured: RequestHandler = (req, res, next) => {
    if (req.user) {
      return next();
    }

    // req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };