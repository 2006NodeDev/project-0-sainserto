import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
// import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
// import { connectionPool } from ".";


export async function getAllReimbursements(){
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let result: QueryResult = await client.query(`select * from reimburzonedata."reimbursements" order by (date_submitted);`)
        return result.rows
    
    } catch(e){
        console.log(e);
        throw new Error('unimplemented error handling')      
    } finally {
        client && client.release()
    }
}

export async function findReimbursementByUserId(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`
        select * from reimburzonedata."reimbursements" r where r."author" = ${id} order by (date_submitted);`)
        if(results.rowCount === 0){
            throw new Error('Not Found')
        }else{
            return results.rows
        }
        // else{
        //     return ReimbursementDTOtoReimbursementConverter(results.row[0])
        // }
    }catch(e){
        if(e.message === 'Not Found'){
            throw new UserNotFoundError()
        }
        console.log(e);
        throw new Error('unimplemented error handling')
        
    } finally{
        client && client.release()
    }
    
}


//find reimbursements by status


export async function findReimbursementByStatusId(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`
        select * from reimburzonedata."reimbursements" r where r."status" = ${id} order by (date_submitted);`)
        if(results.rowCount === 0){
            throw new Error('Not Found')
        }else{
            return results.rows
        }
        // else{
        //     return ReimbursementDTOtoReimbursementConverter(results.row[0])
        // }
    }catch(e){
        if(e.message === 'Not Found'){
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('unimplemented error handling')
        
    } finally{
        client && client.release()
    }
    
}