import { HttpError } from "./HttpErrors";

export class ReimbursementNotFoundError extends HttpError{
    constructor(){
        super(404, 'Reimbursement Not Found')
    }
}