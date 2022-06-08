import dotenv from 'dotenv';
dotenv.config()
//import packageJson from '../package.json' assert {type: "json"};

/**
 * Pattern for config is:
 * key: process.env['KEY'] ?? default
 */
const config = {
    version: "1.0.0",
    name: "bla",
    description: "bla description",
    nodeEnv: 'development',
    port: process.env['PORT'] ?? 3000,

    clientOrigins: {
        'development': process.env['DEV_ORIGIN'] ?? '*',
        'production': process.env['PROD_ORIGIN'] ?? 'none'
    }
}

export default config