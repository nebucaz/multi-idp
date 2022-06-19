import { ErrorRequestHandler } from 'express'
//import config from '../config.js'

/**
 * 500 response & log when errors are raised.
 * https://stackoverflow.com/questions/59584314/typeerror-res-status-is-not-a-function
 * Because the error handling route must accept 4 arguments for express to identify it as an error middleware.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    return res.status(500).json({
        message: `${err}` // config.nodeEnv === 'production' ? 'unknown error' : `${err}`
    })
}

export default errorHandler