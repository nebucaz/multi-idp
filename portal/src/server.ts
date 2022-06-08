//import ts from "typescript"
//console.log(ts.version)
// this worked as of https://github.com/felipeplets/esm-examples/blob/main/package.json

import app from './app.js'
import config from './config.js'

app.listen(config.port, ()=>{
    console.log(`${config.name} ${config.version}`)
    console.log(`Listening on ${config.port} with NODE_ENV=${config.nodeEnv}`)
})
