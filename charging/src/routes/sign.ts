import { User } from "@prisma/client";
import { Router } from "express";
import { SessionData } from "express-session";
import { Issuer, generators } from "openid-client";

const signRouter = Router();

signRouter.use("/id", (req, res) => {
        if (req.isAuthenticated()) {
            console.log("assign user");
            console.log(req.user);
            res.locals.user = req.user;

            // evidence?
            let usr: User = req.user as User;
            if (usr.evidenceTimestamp <= 0 || ((Date.now()/1000) - usr.evidenceTimestamp) > 0) {
                console.log('request evidence')
                res.render('pages/sign/evidence');
            }
            else {
                res.render('pages/sign/authenticated');
            }
        }
        else {
            res.redirect('/sign/idp');
        }
});

signRouter.use("/register", async (req, res) => {
    // https://github.com/panva/node-openid-client/blob/main/docs/README.md
    Issuer.discover('http://localhost:9081/realms/alphabank/').then((issuer) => {
        // console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
        // redirect..

        const code_verifier = generators.codeVerifier();

        // store in session ( using TypeScript Declaration Merging: declared in types/index.d.ts )
        req.session.code_verifier = code_verifier;
        const code_challenge = generators.codeChallenge(code_verifier);

        let client = new issuer.Client({
            client_id: "nodeclient",
            client_secret: process.env.NODECLIENT_SECRET, //"YV718kyogsluzZozvajgg4BH2NEipVzv", // keycloak: set 'Access-Type'=confidential, copy secret from 'Credentials Tab'
            redirect_uris: ["http://localhost:3000/sign/register/cb"],
            response_types: ["code"]
        });

        res.writeHead(302, {
            location: client.authorizationUrl({
                scope: "evidence",
                resource: "http://localhost:3001/api/evidence",
                code_challenge,
                code_challenge_method: 'S256'
            })
        });
        res.end();
    }, (reason) => {
        res.status(500).json({
            name: "Error",
            description: reason,
            version: "1.0.0"
        });
    });
});

signRouter.use("/register/cb", async (req, res) => {
    console.log('evidence callback');

    res.render('pages/sign/what');
});

signRouter.get("/tnc", async (req, res) => {
    console.log('tnc');

    res.render('pages/sign/tnc');
});

signRouter.get("/confirm", async (req, res) => {
    console.log('confirm');

    res.render('pages/sign/confim');
});

signRouter.post("/confirm", async (req, res) => {
    console.log('confirm');

    res.render('pages/sign/confim');
});


signRouter.use("/idp", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/sign/id');
    }

    // FIXME: skip, if authenticated
    console.log("sign idp");
    res.render('pages/sign/chooseIdp');
});

signRouter.use("/", (req, res) => {
    //console.log(req.user);
    console.log("sign root");
    res.render('pages/sign', {user: {name: "bla"}});
});

export default signRouter;