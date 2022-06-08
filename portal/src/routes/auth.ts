import { Router } from 'express'

const authRouter = Router()

authRouter.get('/bank/:provider', (req,res) => {
    console.log(req.params);
});

authRouter.get('/bank', (req,res) => {
    // is authenticated?
    res.send('<html><head><title>Auth</title></head><body><h1>Authenticate</h1><p>Select your bank</p><ul><li><a href="/auth/bank/pf">PostFinance</a></li><li>Beta Bank</li></ul></body></html>');
});
//root.post('/', postRoot)

export default authRouter

