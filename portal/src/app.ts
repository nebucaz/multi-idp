import express from 'express';
import fourOhFour from './middleware/fourOhFour.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';
import session from'express-session';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

// Apply most middleware first
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(session({
    secret: "jFDH94wDUrMVK7YxgGgSJw16zctlJIpI",
    resave: true,
    saveUninitialized: true
}));

/*
app.use(cors({
    // @ts-ignore
    origin: config.clientOrigins[config.nodeEnv]
}))
app.use(helmet())
app.use(morgan('tiny'))

// Apply routes before error handling
app.use('/', root)
*/

// Apply routes before error handling
app.use(routes)

app.get('/', (req, res) => {
  res.send(`<html><head><title>Test</title></head><body><h1>Hello World!</h1>
    <ul><li><a href="/sign">Sign a document</a></li>
    <li><a href="/charge">Charge</a></li></ul></body></html>`);
});

// Apply error handling last
app.use(fourOhFour)
app.use(errorHandler)

export default app

//const googleIssuer = await Issuer.discover('https://accounts.google.com');
//console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata);

/*
app.get('/auth', (req, res) => {

    const client = new googleIssuer.Client({
        client_id: 'zELcpfANLqY7Oqas',
        client_secret: 'TQV5U29k1gHibH5bx1layBo0OSAvAbRT3UYW3EWrSYBB5swxjVfWUa1BS8lqzxG/0v9wruMcrGadany3',
        redirect_uris: ['http://localhost:3000/cb'],
        response_types: ['code'],
        // id_token_signed_response_alg (default "RS256")
        // token_endpoint_auth_method (default "client_secret_basic")
      }); // => Client
});
*/

/*
Random stuff

yDsMVHweIYE7XWwq
MsvIcElHt1GkcayP
ggFiRgLRkj7Vejc3
Z3tuQmNJ28esuwcK
YM0qVh2iso5XyxVZ
gHJrKdqlKNLFbbYm
AaItBShSi1gDyzIv
xysJG7yMEZ2EkpbW
*/