import { HttpError } from "./HttpErrors";

export class StatusIdInputError extends HttpError{
    constructor(){
        super(400, 'Status ID must be a number')
    }
}