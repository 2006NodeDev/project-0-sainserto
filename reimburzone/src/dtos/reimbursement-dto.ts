export class ReimbursementDTO{
    reimbursement_id: number
    author: number
    amount: number
    date_submitted: Date
    date_resolved: Date
    resolver: number
    status: number
    type: number
    description: string
}