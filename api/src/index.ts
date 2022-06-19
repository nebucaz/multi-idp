import express from "express";
import { PORT } from "./config/constants.js";
import passport from "passport";
import { Strategy  } from 'passport-http-bearer'
import dotenv from "dotenv";

import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

// disable sessions

dotenv.config();

const app = express();
app.use(express.json());

// passport: use bearer Strategy
passport.use(new Strategy((token, done) => {
    console.log(token);

    /*
        User.findOne({ token: token }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user, { scope: "read" });
        });
        */

       // introspection ?
        done(null, {name: 'bla'}, { scope: "read" });
    })
);

/*
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
*/

app.use(passport.initialize());

// routes
// Apply routes before error handling
app.use(routes);

// Apply error handling last
// app.use(fourOhFour);
// app.use(errorHandler);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
