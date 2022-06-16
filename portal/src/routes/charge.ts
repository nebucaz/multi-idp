import { Router } from 'express';
import { IdTokenClaims, Issuer, TokenSet } from 'openid-client';

//import signing from '../controllers/signing.js'
//import postRoot from '../controllers/root/postRoot'

const chargeRouter = Router();

chargeRouter.get('/', async (req, res) => {
    // is authenticated?
    let tokenSet: TokenSet = req.session["tokenSet"];
    if (tokenSet !== undefined) {
        console.log('charge');

        // try to access api using access token
        res.send(`<html><head><title>Charge</title></head></body>
        <h1>Charge</h1>
        <li><a href="/resources/api">API</a></li></ul>
        </body></html>`)
    }
    else {
        res.send(`<html><head><title>Charge</title></head></body>
        <h1>Charge</h1>
        <li><a href="/auth/bank">I want to authenticate with my bank login</a></li></ul>
        </body></html>`)
    }
});

export default chargeRouter;