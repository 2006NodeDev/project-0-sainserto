import { HttpError } from "./HttpErrors";

export class UserNotFoundError extends HttpError{
    constructor(){
        super(404, 'User does not exist.')
    }
}