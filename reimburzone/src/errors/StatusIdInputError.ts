import { HttpError } from "./HttpErrors";

export class StatusIdInputError extends HttpError{
    constructor(){
        super(400, 'status id must be a number')
    }
}