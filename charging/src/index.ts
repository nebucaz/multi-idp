import express from "express";
import { PORT } from "./config/constants.js";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Issuer, Strategy, TokenSet } from "openid-client";

import routes from "./routes/index.js";
import fourOhFour from "./middleware/fourOhFour.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

// we use dev-proxy..
// https://github.com/panva/node-openid-client/discussions/435
app.set('trust proxy', 1);

// sesssion
app.use(
    session({
        secret: "jFDH94wDUrMVK7YxgGgSJw16zctlJIpI",
        resave: true,
        saveUninitialized: true,
    })
);

// Issuer

const alphaIssuer = await Issuer.discover(
    "http://localhost:9081/realms/alphabank/"
);
let alphaClient = new alphaIssuer.Client({
    client_id: "nodeclient",
    client_secret: process.env.NODECLIENT_SECRET,
});

// const betaIssuer = await Issuer.discover('http://localhost:9081/realms/betabank/');

// passport
// https://github.com/panva/node-openid-client/blob/main/docs/README.md#strategy
passport.use("alpha", new Strategy(
        {
            client: alphaClient,
            params: {
                client_id: "nodeclient",
                client_secret: process.env.NODECLIENT_SECRET, //"YV718kyogsluzZozvajgg4BH2NEipVzv", // keycloak: set 'Access-Type'=confidential, copy secret from 'Credentials Tab'
                redirect_uri: "http://localhost:3000/auth/cb",
            },
        },
        (tokenSet: TokenSet, done: (err: any, user?: any) => void) => {
            // FIXME: store user in DB
            done(null, {});
        }
    )
);

// https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
passport.serializeUser((user: any, next) => {
    next(null, user);
});

passport.deserializeUser((obj: any, next) => {
    next(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// codeburst.io/how-to-implement-openid-authentication-with-openid-client-and-passport-in-node-js-43d020121e87
// auth routes
// /auth/callback
// /auth

// routes
// Apply routes before error handling
app.use(routes);

app.get("/", (req, res) => {
    res.send(`<html><head><title>Test</title></head><body><h1>Hello World!</h1>
    <ul><li><a href="/sign">Sign a document</a></li>
    <li><a href="/charge">Charge</a></li>
    <li><a href="/auth/login">Login</a></li></ul></body></html>`);
});

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// --> basic crud controller
// https://betterprogramming.pub/create-an-express-server-using-typescript-dec8a51e7f8d
