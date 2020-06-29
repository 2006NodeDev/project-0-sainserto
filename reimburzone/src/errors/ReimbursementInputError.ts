import { HttpError } from "./HttpErrors";

export class ReimbursementInputError extends HttpError{
    constructor(){
        super(400, 'Please Fill Out All Fields')
    }
}