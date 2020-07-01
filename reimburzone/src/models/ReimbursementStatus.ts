export class ReimbursementStatus{
    statusId: number
    status: string

    constructor(statusId: number, status: string){
        this.statusId = statusId
        this.status = status
    }
}

//1 - pending, 2 - approved, 3 - denied