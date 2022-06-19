import { Router } from 'express'
import { Issuer, generators, TokenSet } from 'openid-client';
//import { RequestContext } from '../helpers/RequestContext';

// https://github.com/Belphemur/node-json-db
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js'

const authRouter = Router()
const db = new JsonDB(new Config("idp-users", true, false, '.'));

interface User {
    // sub used as key "sub":"d51c19dd-abb3-494b-a314-8f92a17746f9",
    email_verified: Boolean,
    name: string,
    given_name: string,
    family_name: string,
    email: string, //"user@test.com"}
    iss: string
}

authRouter.get('/logout', async (req, res) => {
    console.log('logout');

    const issuer = await Issuer.discover('http://localhost:9081/realms/alphabank/');

    let client = new issuer.Client({
        client_id: "nodeclient",
        client_secret: process.env.NODECLIENT_SECRET
    });

    // FIXME: check, if logged in
    let tokenSet: TokenSet = req.session['tokenSet'];

    if (tokenSet !== undefined) {
        const logout = client.endSessionUrl({
            id_token_hint: tokenSet.id_token,
            state: tokenSet.session_state,
            post_logout_redirect_uri: "http://localhost:3000/auth/loggedout"
        });

        res.writeHead(302, {
            location: logout
        });
        res.end()
    }

    res.writeHead(302, {
        location: "http://localhost:3000/auth/loggedout"
    });
    res.end()
});


authRouter.get('/loggedout', async (req, res) => {
    // delete session params
    req.session['tokenSet'] = undefined;
    req.session['claims'] = undefined;

    res.send(`<html><head><title>Logged out</title></head>
    <body><h1>Logged out</h1><p><a href="/">Home</a>
    </body></html>`);
});

authRouter.get('/bank', (req, res) => {
    res.send(`<html><head><title>Auth</title></head>
    <body><h1>Authenticate</h1><p>Select your bank</p>
    <ul><li><a href="/auth/bank/a">Alpha Bank</a></li>
    <li><a href="/auth/bank/b">Beta Bank</a></li></ul>
    </body></html>`);
});
//root.post('/', postRoot)

// Authorization code flow
authRouter.get('/bank/:provider', (req, res) => {
    console.log("auth redirect");

    // FIXME: maybe store this result?
    // FIXME: realm based on provider

    // https://github.com/panva/node-openid-client/blob/main/docs/README.md
    Issuer.discover('http://localhost:9081/realms/alphabank/').then((issuer) => {
        // console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
        // redirect..

        const code_verifier = generators.codeVerifier();

        // store in session
        req.session['code_verifier'] = code_verifier;
        const code_challenge = generators.codeChallenge(code_verifier);

        let client = new issuer.Client({
            client_id: "nodeclient",
            client_secret: process.env.NODECLIENT_SECRET, //"YV718kyogsluzZozvajgg4BH2NEipVzv", // keycloak: set 'Access-Type'=confidential, copy secret from 'Credentials Tab'
            redirect_uris: ["http://localhost:3000/auth/bank/a/evidence"],
            response_types: ["code"]
        });

        res.writeHead(302, {
            location: client.authorizationUrl({
                scope: "openid",
                resource: "http://localhost:3000/resources/bank/a/evidence",
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


    // res.send("<html><head><title>Auth Forwarder</title></head><body>You will be forwarded to log in</body></html>")
});

authRouter.get('/bank/:provider/evidence', async (req, res) => {
    // console.log("evidence");
    // discover again?
    // authorize api access
    Issuer.discover('http://localhost:9081/realms/alphabank/').then((issuer) => {
        let client = new issuer.Client({
            client_id: "nodeclient",
            client_secret: process.env.NODECLIENT_SECRET,
        });

        const code_verifier = req.session['code_verifier'];
        const params = client.callbackParams(req);

        try {
            client.callback('http://localhost:3000/auth/bank/a/evidence', params, { code_verifier }).then((tokenSet) => {
                //console.log('received and validated tokens %j', tokenSet);
                // {"exp":1655114680,"iat":1655114380,"auth_time":1655110658,"jti":"d24f26af-1165-406a-bdc2-9c77510958d7","iss":"http://localhost:9081/realms/alphabank","aud":"nodeclient","sub":"d51c19dd-abb3-494b-a314-8f92a17746f9","typ":"ID","azp":"nodeclient","session_state":"4ebad6b8-2b24-4d8a-befd-fac193bcd2d9","at_hash":"Fqg3PUzZexQjk46YggPSoA","acr":"0","sid":"4ebad6b8-2b24-4d8a-befd-fac193bcd2d9","email_verified":true,"name":"User Test","preferred_username":"user","given_name":"User","family_name":"Test","email":"user@test.com"}

                //console.log('validated ID Token claims %j', tokenSet.claims());
                // {"sub":"d51c19dd-abb3-494b-a314-8f92a17746f9","email_verified":true,"name":"User Test","preferred_username":"user","given_name":"User","family_name":"Test","email":"user@test.com"}

                //let context: RequestContext = new RequestContext(req);

                const access_token = tokenSet.access_token;

                // FIXME: bette solution
                // req.oidc propbably set by passport
                // https://stackoverflow.com/questions/65387843/express-request-isauthenticated

                req.session['tokenSet'] = tokenSet;
                req.session['claims'] = tokenSet.claims();

                // now, get user info
                /*
                // where to get access_token?
                const userinfo = await
                client.userinfo(access_token);
                console.log('userinfo %j', userinfo);
*/

                // decide, if we need to request user info
                // or access the evidence record..

                client.userinfo(tokenSet).then((userInfo) => {
                    res.send(`<html><head><title>User Info</title></head><body><h1>UserInfo</h1>
                    <p>${JSON.stringify(tokenSet.claims())}</p><p>${JSON.stringify(userInfo)}</p>
                    <ul><li><a href="/resources/evidence">Evidence</a></li>
                    <li><a href="/resources/api">API</a> (needs api-role-alphabank)</li></ul>
                    <a href="/auth/logout">Logout</a>
                    </body></html>`)

                    // get evidence and store
                    // consent?
                    //

                }, (reason) => {
                    res.status(200).json({
                        name: "auth code flow",
                        description: "jaja",
                        version: "1.0.0"
                    });
                });

            });
        }
        catch (e: any) {
            console.log(e);
            res.send(`<html><head><title>Auth Success</title></head><body><h1>Server Error</h1><p>${e}</p></body></html>`)
        }
    }, (reason) => {
        res.send("<html><head><title>Auth Error</title></head><body><h1>Falure</h1><p>Could not authenticate</p></body></html>")
        console.log(reason);
    });
    //    res.send("<html><head><title>Auth Success</title></head><body><h1>Success</h1><p>You are logged in!<p><ul><li>Scope: UserInfo</li></ul></body></html>")
});

authRouter.get('/bank/:provider/implicit', async (req, res) => {
    const issuer = await Issuer.discover('http://localhost:9081/realms/alphabank/');

    let client = new issuer.Client({
        client_id: "nodeimplicit",
        redirect_uris: ['http://localhost:3000/auth/bank/a/implicit'],
        response_types: ['id_token'],
    });

    const nonce = generators.nonce();
    // store in session
    req.session['nonce'] = nonce;
    //console.log(req);

    const redirect =
    res.writeHead(302, {
        location: client.authorizationUrl({
            scope: 'openid email profile',
            response_mode: 'form_post',
            nonce,
        })
    });
    res.end();
});

authRouter.post('/bank/:provider/implicit', async (req, res) => {
    console.log('form post');
    const issuer = await Issuer.discover('http://localhost:9081/realms/alphabank/');
    let client = new issuer.Client({
        client_id: "nodeimplicit",
        redirect_uris: ['http://localhost:3000/auth/bank/a/implicit'],
        response_types: ['id_token'],
    });
    // assumes req.body is populated from your web framework's body parser
    const params = client.callbackParams(req);
    const nonce = req.session['nonce'];

    client.callback('http://localhost:3000/auth/bank/a/implicit', params, { nonce }).then((tokenSet) => {
        console.log('received and validated tokens %j', tokenSet);
        console.log('validated ID Token claims %j', tokenSet.claims());
    });
});





authRouter.get('/bank/:provider', (req, res) => {
    console.log("whatever")
});



export default authRouter

/*
Implicit flow

const client = new googleIssuer.Client({
  client_id: 'zELcpfANLqY7Oqas',
  redirect_uris: ['http://localhost:3000/cb'],
  response_types: ['id_token'],
  // id_token_signed_response_alg (default "RS256")
}); // => Client

*/