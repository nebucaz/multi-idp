import { Request } from "express";

export class RequestContext {
    access_token: string;
    refresh_token: string;
    id_token: string
    token_set: any;
    //token_type: string;
    expires_at : number

    constructor() {
        this.id_token = "";
        this.token_set = {};
        this.access_token = "";
        this.refresh_token = "";
    }

    update(tokenSet) {
        this.access_token = tokenSet.access_token;
        this.id_token = tokenSet.claims();
    }

    isAuthenticated() {
        // FIXME:
        return (this.id_token) ? true : false;
    }

    logOut() {
        this.id_token = "";
    }
}

export class RequestContextFactory {
    context: RequestContext;

    constructor() {
    }

    fromRequest(req: Request) {
        if (req.session.hasOwnProperty('oidc')) {
            this.context = req.session['oidc'] as RequestContext;
        }
        else {
            this.context = new RequestContext();
        }

        return this;
    }
}
