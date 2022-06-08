import { Router } from 'express';
//import signing from '../controllers/signing.js'
//import postRoot from '../controllers/root/postRoot'

const signRouter = Router()

signRouter.get('/', (req,res) => {
    // is authenticated?
    res.send('<html><head><title>Sign</title></head><body><h1>Authenticate</h1><p>You must authenticate to sign a document</p><ul><li>A have a Swisscom Trust Services Account</li><li><a href="/auth/bank">I want to authenticate with my bank login</a></li></ul></body></html>');
});
//root.post('/', postRoot)

export default signRouter
