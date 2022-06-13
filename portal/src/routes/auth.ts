import { Router } from 'express'
import { Issuer } from 'openid-client';

const authRouter = Router()

authRouter.get('/bank/:provider', (req,res) => {
    console.log(req.params);
    // redirect to idp of

    Issuer.discover('https://accounts.google.com').then((issuer) => {
        console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
        // redirect..
    })
    res.send("<html><head><title>Auth Forwarder</title></head><body>You will be forwarded to log in</body></html>")
});

authRouter.get('/bank', (req,res) => {
    // is authenticated?
    res.send('<html><head><title>Auth</title></head><body><h1>Authenticate</h1><p>Select your bank</p><ul><li><a href="/auth/bank/a">Alpha Bank</a></li><li><a href="/auth/bank/b">Beta Bank</a></li></ul></body></html>');
});
//root.post('/', postRoot)

export default authRouter

