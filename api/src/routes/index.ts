import { Router } from "express";
import express, { Request, Response } from "express";
import passport from "passport";

const routes = Router();

// https://betterprogramming.pub/create-an-express-server-using-typescript-dec8a51e7f8d

routes.get('/api/me', passport.authenticate('bearer', { session: false }),
    (req, res) => {
        res.json(req.user);
    }
);

routes.get('/api', passport.authenticate('bearer', { session: false }),
    (req: Request, res: Response) => {
        res.status(200).json({foo: "bar"});
    }
);

routes.get('/api/evidence', passport.authenticate('bearer', { session: false }),
    (req: Request, res: Response) => {
        res.status(200).json({evidence: "bar"});
    }
);

routes.get('/', (req, res) => {
    res.status(200).json({status: "OK"});
});

export default routes