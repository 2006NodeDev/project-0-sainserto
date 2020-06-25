import { HttpError } from "./HttpErrors";

export class AuthFailureError extends HttpError{
    constructor(){
        super(401, 'Incorrect Username or Password')
    }
}