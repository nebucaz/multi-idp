import { RequestHandler } from 'express'

/**
 * Health check endpoint
 */
const getCalendar: RequestHandler = (req, res) => {
    res.status(200).json({
        name: "lalelu",
        description: "anyway",
        version: "1.0.0"
    });
}

export default getCalendar