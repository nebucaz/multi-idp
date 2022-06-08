import { RequestHandler } from 'express'

/**
 * Health check endpoint
 */
const signing: RequestHandler = (req, res) => {
    console.log("bladibla");

    res.status(200).json({
        name: "lalelu",
        description: "anyway",
        version: "1.0.0"
    });
}

export default signing