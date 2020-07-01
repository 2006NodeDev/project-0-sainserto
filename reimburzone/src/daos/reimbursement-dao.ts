import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement-Converter";
import { ReimbursementInputError } from "../errors/ReimbursementInputError";

export async function getAllReimbursements() {
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let result: QueryResult = await client.query(`select * from reimburzonedata."reimbursements" r 
        left join reimburzonedata.reimbursement_status s on r."status" = s.status_id 
        left join reimburzonedata.reimbursement_type t on r."type" = t.type_id
        order by (date_submitted);`)
        // return result.rows
        return result.rows.map(ReimbursementDTOtoReimbursementConverter)
    } catch (e) {
        console.log(e);
        throw new Error('unimplemented error handling')
    } finally {
        client && client.release()
    }
}

export async function findReimbursementByUserId(id: number) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query
            (`select * from reimburzonedata."reimbursements" r 
            left join reimburzonedata."reimbursement_status" s on r."status" = s.status_id 
            left join reimburzonedata.reimbursement_type t on r."type" = t.type_id
            where r."author" = ${id} order by (date_submitted)`)

        if (results.rowCount === 0) {
            throw new Error('Not Found')
        } else {
            // return results.rows
            return results.rows.map(ReimbursementDTOtoReimbursementConverter)
            // return ReimbursementDTOtoReimbursementConverter(results.rows[0])
        }
    } catch (e) {
        if (e.message === 'Not Found') {
            throw new UserNotFoundError()
        }
        console.log(e);
        throw new Error('Unimplemented Error Handling')

    } finally {
        client && client.release()
    }
}

//find reimbursements by status
export async function findReimbursementByStatusId(id: number) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`
        select * from reimburzonedata."reimbursements" r 
        left join reimburzonedata."reimbursement_status" s on r."status" = s.status_id 
        left join reimburzonedata.reimbursement_type t on r."type" = t.type_id
        where r."status" = ${id} order by (date_submitted)`)

        if (results.rowCount === 0) {
            throw new Error('Not Found')
        } else {
            return results.rows.map(ReimbursementDTOtoReimbursementConverter)
        }

    } catch (e) {
        if (e.message === 'Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('unimplemented error handling')

    } finally {
        client && client.release()
    }

}

export async function saveOneReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        let statusId = await client.query(`select s."status_id" from reimburzonedata.reimbursement_status s where s."status" = $1`,[newReimbursement.status])
        if (statusId.rowCount === 0) {
            throw new Error('Status Not Found')
        }
        statusId = statusId.rows[0].status_id

        let typeId = await client.query(`select t."type_id" from reimburzonedata.reimbursement_type t where t."type" = $1`,[newReimbursement.type])
        if (typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id

        let results = await client.query(`insert into reimburzonedata.reimbursements ("author", "amount", "date_submitted", "date_resolved", "resolver", "description", "status", "type")
            values($1, $2, $3, $4, $5, $6, $7, $8) returning "reimbursement_id"`,
            [
                newReimbursement.author,
                newReimbursement.amount,
                newReimbursement.dateSubmitted,
                newReimbursement.dateResolved,
                newReimbursement.resolver,
                newReimbursement.description,
                statusId,
                typeId
            ])

        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        await client.query('COMMIT;')
        return newReimbursement
    } catch (e) {
        client && client.query('ROLLBACK;')
        if (e.message === 'Status Not Found') {
            throw new Error('Status Input Error')
        }

        console.log(e);
        throw new Error('Unhandled Error Occured')

    } finally {
        client && client.release();
    }
}

export async function updateReimbursement(id: number, newReimbursement: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient
    client = await connectionPool.connect()
    await client.query('BEGIN;')
    try {
        let reimbursementQuery = await client.query(`select * from reimburzonedata.reimbursements where "reimbursement_id" = $1;`, [id])
        let reimbursementResults = ReimbursementDTOtoReimbursementConverter(reimbursementQuery.rows[0])
        for (let key in newReimbursement) {
            if (newReimbursement[key] === undefined) {
                newReimbursement[key] = reimbursementResults[key]
            }
        }

        let statusId = await client.query(`select s."status_id" from reimburzonedata."reimbursement_status" s where s."status" = $1`,
            [newReimbursement.status])
        if (statusId.rowCount === 0) {
            throw new Error('Status Not Found')
        }
        statusId = statusId.rows[0].status_id

        let typeId = await client.query(`select t."type_id" 
                                        from reimburzonedata."reimbursement_type" t where t."type" = $1`,
            [newReimbursement.type])
        if (typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id

        await client.query(`update reimburzonedata.reimbursements set "author" = $1, "amount" = $2, "date_submitted" = $3, "date_resolved" = $4, 
                            "resolver" = $5, "description" = $6, "status" = $7, "type" = $8 where "reimbursement_id" = $9`,
            [
                newReimbursement.author,
                newReimbursement.amount,
                newReimbursement.dateSubmitted,
                newReimbursement.dateResolved,
                newReimbursement.resolver,
                newReimbursement.description,
                statusId,
                typeId,
                id])
        await client.query('COMMIT;')
        return newReimbursement

    } catch (e) {
        client && client.query('ROLLBACK;')
        console.log(e);
        if (e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new ReimbursementInputError()
        }
        throw new Error('Internal Server Error')
    } finally {
        client && client.release();
    }
}