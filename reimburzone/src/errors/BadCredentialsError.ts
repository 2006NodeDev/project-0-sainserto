import { HttpError } from "./HttpErrors";

export class BadCredentialsError extends HttpError{
    constructor(){
        super(400, 'Invalid Credentials')
    }
}