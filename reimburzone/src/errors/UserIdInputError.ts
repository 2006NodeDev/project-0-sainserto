import { HttpError } from "./HttpErrors";

export class UserIdInputError extends HttpError{
    constructor(){
        super(400, 'ID must be a number.')
    }
}