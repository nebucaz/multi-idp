declare global {
    declare module "express-session" {
        interface SessionData {
            code_verifier?: String;
        }
    }
}
