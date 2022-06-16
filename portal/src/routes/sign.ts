import { Router } from "express";
import { IdTokenClaims, Issuer, TokenSet } from "openid-client";

//import signing from '../controllers/signing.js'
//import postRoot from '../controllers/root/postRoot'

const signRouter = Router();

signRouter.get("/", async (req, res) => {
    // is authenticated?
    console.log("sign");
    //console.log(req);

    let tokenSet = {};
    // FIXME: use passport/RequestContext
    if (req.session.hasOwnProperty("tokenSet")) {
        /* {
            access_token:
            expires_at:
            refresh_expires_in:
            refresh_token:
            token_type:
            id_token:
            session_state:
            scope:
        */
        let tokenSet: TokenSet = req.session["tokenSet"];

        /* Claims
            exp: 1655210910,
            iat: 1655210610,
            auth_time: 1655210148,
            jti: '0c414a7a-8217-4239-837f-e3ac387faf90',
            iss: 'http://localhost:9081/realms/alphabank',
            aud: 'nodeclient',
            sub: 'd1812e21-b103-4e5e-90ad-09b698d18cb9',
            typ: 'ID',
            azp: 'nodeclient',
            session_state: '3deb80a7-e437-4227-8275-87abfd7e5244',
            at_hash: 'xP9wp2DJeCIBBeRBi37n2A',
            acr: '0',
            sid: '3deb80a7-e437-4227-8275-87abfd7e5244',
            email_verified: true,
            name: 'User Test',
            preferred_username: 'user',
            given_name: 'User',
            family_name: 'Test',
            email: 'user@test.com'
        */
        let claims: IdTokenClaims = req.session["claims"];

        //if (tokenSet.hasOwnProperty('id_token')) {
        //console.log(tokenSet);
        //console.log(claims);

        res.send(`<html><head><title>Sign</title></head><body>
            <h1>Welcome</h1><p>Hello ${claims.name}, you are logged in</p>
            <ul><li>Expires: ${claims.exp}</li><li>Logged-in at: ${claims.auth_time}</li>
            <li>Issuer: ${claims.iss}</li></ul>
            <ul><li><a href="/resources/evidence">Evidence</a></li>
            <a href="/auth/logout">Logout</a>
            </body></html>`);

        /*
            // introspection only for access-tokens?
            const issuer = await Issuer.discover('http://localhost:9081/realms/alphabank/');

            let client = new issuer.Client({
                client_id: "nodeclient",
                client_secret: process.env.NODECLIENT_SECRET
            });

            let introspection = await client.introspect(tokenSet.id_token, tokenSet.token_type);
            console.log(introspection);
            res.send(introspection);
            */
        //}
    } else {
        // <li><a href="/auth/bank/a/implicit">Implicit</a></li>
        res.send(
            "<html><head><title>Sign</title></head>" +
                "<body><h1>Authenticate</h1><p>You must authenticate to sign a document</p>" +
                "<ul><li>A have a Swisscom Trust Services Account</li>" +
                '<li><a href="/auth/bank">I want to authenticate with my bank login</a></li></ul>' +
                "<ul>" +
                '<li><a href="/resources/evidence">Evidence</a></li>' +
                '<li><a href="/resources/api">API</a></li></ul>' +
                "</body></html>"
        );
    }
});

signRouter.get("/:step", async (req, res) => {
    let step = 0;

    if (req.params.hasOwnProperty("step")) {
        step = parseInt(req.params["step"]);

        switch (step) {
            case 2:
                console.log("step 2: check evidence");
                break;
            case 3:
                console.log("step 3: tnc");
                break;
            case 4:
                console.log("step 4: re-auth to sign");
                break;
            default:
                console.log("invalid step");
                break;
        }
        res.send(`step = ${step}`);
    } else {
        console.log("bad request");
        res.status(400);
        res.end();
    }
});

export default signRouter;
