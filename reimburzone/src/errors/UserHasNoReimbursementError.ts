import { HttpError } from "./HttpErrors";

export class UserHasNoReimbursementError extends HttpError{
    constructor(){
        super(404, 'This user has no reimbursements.')
    }
}