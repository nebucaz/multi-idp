import express from "express";
import { PORT } from "./config/constants.js";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Issuer, Strategy, TokenSet } from "openid-client";
import { PrismaClient } from "@prisma/client";

import routes from "./routes/index.js";
import fourOhFour from "./middleware/fourOhFour.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

// https://blog.logrocket.com/how-to-use-ejs-template-node-js-application/
app.set('view engine', 'ejs')

app.use(express.static('public'))

// we use dev-proxy..
// https://github.com/panva/node-openid-client/discussions/435
app.set('trust proxy', 1);

// use database
const prisma = new PrismaClient();


// sesssion
app.use(
    session({
        secret: "jFDH94wDUrMVK7YxgGgSJw16zctlJIpI",
        resave: true,
        saveUninitialized: true,
    })
);

// Issuers
const alphaIssuer = await Issuer.discover(
    "http://localhost:9081/realms/alphabank/"
);
let alphaClient = new alphaIssuer.Client({
    client_id: "nodeclient",
    client_secret: process.env.NODECLIENT_SECRET,
    post_logout_redirect_uris: ['http://localhost:3000/logged']
});

// const betaIssuer = await Issuer.discover('http://localhost:9081/realms/betabank/');

// passport & prisma ORM
// https://github.com/panva/node-openid-client/blob/main/docs/README.md#strategy
// https://www.freecodecamp.org/news/build-nodejs-database-using-prisma-orm/
passport.use("alpha", new Strategy(
        {
            client: alphaClient,
            params: {
                client_id: "nodeclient",
                client_secret: process.env.NODECLIENT_SECRET, //"YV718kyogsluzZozvajgg4BH2NEipVzv", // keycloak: set 'Access-Type'=confidential, copy secret from 'Credentials Tab'
                redirect_uri: "http://localhost:3000/auth/alpha/cb",
            },
        },
        (tokenSet: TokenSet, done: (err: any, user?: any) => void) => {
            // where to store access/refresh tokens?
            // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert
            prisma.user.upsert({
                create: {
                    iss: tokenSet.claims().iss,
                    sub: tokenSet.claims().sub,
                    email: tokenSet.claims().email ?? "",
                    name: tokenSet.claims().name ?? ""
                },
                update: {},
                where: {
                    sub_iss: {sub: tokenSet.claims().sub, iss: tokenSet.claims().iss}
                }
              }).then((user) => {
                done(null, user); // tokenSet.claims()
              });
        }
    )
);


// https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
passport.serializeUser((user: any, next) => {
    //console.log("s " + JSON.stringify(user));
    next(null, user);
});

passport.deserializeUser((obj: any, next) => {
    //console.log("d " + JSON.stringify(obj));
    next(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// Creating custom middleware with Express
// codeburst.io/how-to-implement-openid-authentication-with-openid-client-and-passport-in-node-js-43d020121e87
// https://auth0.com/blog/create-a-simple-and-secure-node-express-app/
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Apply routes before error handling
app.use(routes);

app.get("/", (req, res) => {
    res.render('pages/index');
});

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// --> basic crud controller
// https://betterprogramming.pub/create-an-express-server-using-typescript-dec8a51e7f8d


/* Token Set
[start:dev] {
[start:dev]   exp: 1655459852,
[start:dev]   iat: 1655459552,
[start:dev]   auth_time: 1655458077,
[start:dev]   jti: 'a9c3de7e-3357-42f7-8f73-13f2f7c1ffa1',
[start:dev]   iss: 'http://localhost:9081/realms/alphabank',
[start:dev]   aud: 'nodeclient',
[start:dev]   sub: 'd1812e21-b103-4e5e-90ad-09b698d18cb9',
[start:dev]   typ: 'ID',
[start:dev]   azp: 'nodeclient',
[start:dev]   session_state: '9df8eceb-d3cd-405a-a662-34535e8d7b2f',
[start:dev]   at_hash: 'IzfW_kap5jOZYFfaSE6ReQ',
[start:dev]   acr: '0',
[start:dev]   sid: '9df8eceb-d3cd-405a-a662-34535e8d7b2f',
[start:dev]   email_verified: true,
[start:dev]   name: 'User Test',
[start:dev]   preferred_username: 'user',
[start:dev]   given_name: 'User',
[start:dev]   family_name: 'Test',
[start:dev]   email: 'user@test.com'
[start:dev] }
*/