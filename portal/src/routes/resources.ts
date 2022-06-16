import { Router } from 'express';
import { IntrospectionResponse, Issuer, TokenSet } from 'openid-client';

const resourcesRouter = Router();

resourcesRouter.get('/api', async (req,res) => {
    console.log('api');

    const issuer = await Issuer.discover('http://localhost:9081/realms/alphabank/');
    let client = new issuer.Client({
        client_id: "nodeclient",
        client_secret: process.env.NODECLIENT_SECRET
    });

    // FIXME: check, if logged in
    let tokenSet: TokenSet = req.session['tokenSet'];
    if (tokenSet !== undefined && tokenSet.hasOwnProperty('access_token')) {
        // introspect (?)
        client.introspect(tokenSet.access_token, 'access_token').then((response) => {
            const introspectionResponse: IntrospectionResponse = response as IntrospectionResponse;
            // console.log(introspectionResponse.realm_access['roles']);
            const roles: Array<string> = introspectionResponse.realm_access['roles'];
            if (!roles.includes('api-role-alphabank')) {
                res.status(403);
                res.end();
            }

            res.send('<html><head><title>Resource</title></head><body><h1>API</h1><p>API</p></body></html>');
            /*
            Needs api-role-alphabank

              realm_access: {
    roles: [
      'offline_access',
      'uma_authorization',
      'default-roles-alphabank'
    ]
  },
  */

        }, (reason) => {
            console.log(reason);
            res.status(403);
            res.end();
        });
    }
    else {
        res.status(403);
        res.send("Forbidden");
    }

    // is authenticated?
    // check access
    // res.send('<html><head><title>Resource</title></head><body><h1>API</h1><p>Bank</p></body></html>');
});

resourcesRouter.get('/evidence', (req,res) => {
    console.log('evidence');

    // is authenticated?
    res.send('<html><head><title>Resource</title></head><body><h1>Evidence</h1><p>Evidence</p></body></html>');
});

export default resourcesRouter;

