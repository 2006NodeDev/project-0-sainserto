import { HttpError } from "./HttpErrors";

export class ReimbursementIdInputError extends HttpError{
    constructor(){
        super(400, 'ID must be a number.')
    }
}