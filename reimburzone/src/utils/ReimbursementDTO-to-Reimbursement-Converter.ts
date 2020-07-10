import { ReimbursementDTO } from "../dtos/reimbursement-dto"
import { Reimbursement } from "../models/Reimbursement"


export function ReimbursementDTOtoReimbursementConverter(rdto: ReimbursementDTO): Reimbursement {
    return {
        reimbursementId: rdto.reimbursement_id,
        author: rdto.author,
        amount: rdto.amount,
        dateSubmitted: rdto.date_submitted,
        dateResolved: rdto.date_resolved,
        resolver: rdto.resolver,
        status: {
            statusId: rdto.status_id,
            status: rdto.status
        },
        type: {
            typeId: rdto.type_id,
            type: rdto.type
        },
        description: rdto.description
    }
}
