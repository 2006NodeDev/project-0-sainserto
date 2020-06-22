import { ReimbursementType } from "./ReimbursementType"
import { ReimbursementStatus } from "./ReimbursementStatus"

export class Reimbursement{
    reimbursementId: number
    author: number
    amount: number
    dateSubmitted: number
    dateResolved: number
    description: string
    resolver: number
    status: ReimbursementStatus
    type: ReimbursementType
}