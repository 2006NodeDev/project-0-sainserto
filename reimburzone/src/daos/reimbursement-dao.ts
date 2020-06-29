import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { Reimbursement } from "../models/Reimbursement";
// import { User } from "../models/User";
// import { users } from "../routers/user-router";

// import { connectionPool } from ".";


export async function getAllReimbursements() {
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let result: QueryResult = await client.query(`select * from reimburzonedata."reimbursements" order by (date_submitted);`)
        return result.rows

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
        let results: QueryResult = await client.query(`
        select * from reimburzonedata."reimbursements" r where r."author" = ${id} order by (date_submitted);`)
        if (results.rowCount === 0) {
            throw new Error('Not Found')
        } else {
            return results.rows
        }
        // else{
        //     return ReimbursementDTOtoReimbursementConverter(results.row[0])
        // }
    } catch (e) {
        if (e.message === 'Not Found') {
            throw new UserNotFoundError()
        }
        console.log(e);
        throw new Error('unimplemented error handling')

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
        select * from reimburzonedata."reimbursements" r where r."status" = ${id} order by (date_submitted);`)
        if (results.rowCount === 0) {
            throw new Error('Not Found')
        } else {
            return results.rows
        }
        // else{
        //     return ReimbursementDTOtoReimbursementConverter(results.row[0])
        // }
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
        // let author = await 
        await client.query('BEGIN;')//start a transaction

        let statusId = await client.query(`select s."status_id" 
                from reimburzonedata.reimbursement_status s where s."status" = $1`,
            [newReimbursement.status])
        if (statusId.rowCount === 0) {
            throw new Error('Status Not Found')
        }

        statusId = statusId.rows[0].status_id

        let typeId = await client.query(`select t."type_id" 
                from reimburzonedata.reimbursement_type t where t."type" = $1`,
            [newReimbursement.type])
        if (typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id

        let results = await client.query(`insert into reimburzonedata.reimbursements (
            "author", "amount", "date_submitted", "date_resolved", "resolver", "description", "status", "type")
            values($1, $2, $3, $4, $5, $6, $7, $8) returning "reimbursement_id"`,
            [
                newReimbursement.author,
                newReimbursement.amount,
                newReimbursement.dateSubmitted,
                newReimbursement.dateResolved,
                newReimbursement.resolver,
                newReimbursement.description,
                // newReimbursement.status,
                statusId,
                // newReimbursement.type

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


    // try {
    //     client = await connectionPool.connect()
    //     let roleId = await client.query(`select r."role_id" from reimburzonedata.roles r 
    //                                     where r."role" = $1`, [newUser.role])
    //     if (roleId.rowCount === 0) {
    //         throw new Error('Role Not Found')
    //     }

    //     roleId = roleId.rows[0].role_id
    //     let results = await client.query(`insert into reimburzonedata.users ("username",
    //     "password", "first_name", "last_name", "email", "role") 
    //     values($1,$2,$3,$4,$5,$6) returning "user_id"`,
    //         [newUser.username, newUser.password, newUser.firstName, newUser.lastName,
    //         newUser.email, roleId])
    //     newUser.userId = results.rows[0].user_id
    //     await client.query('COMMIT;')
    //     return newUser
    // } catch (e) {
    //     client && client.query('ROLLBACK;')
    //     if (e.message === 'Role Not Found') {
    //         throw new UserInputError()
    //     }
    //     console.log(e);
    //     throw new Error('Unhandled Error Occured')

    // } finally {
    //     client && client.release()
    // }
}