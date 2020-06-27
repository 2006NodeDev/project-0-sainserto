import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
// import { connectionPool } from ".";


export async function getAllReimbursements(){
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let result: QueryResult = await client.query(`select * from reimburzone.reimbursements`)
        return result.rows
    
    } catch(e){
        console.log(e);
        throw new Error('unimplemented error handling')      
    } finally {
        client && client.release()
    }
}

export async function findReimbursementById(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`
        select * from reimburzone.reimbursements r where r.reimbursement_id = ${id}`)
        if(results.rowCount === 0){
            throw new Error('NotFound')
        }
        // else{
        //     return ReimbursementDTOtoReimbursementConverter(results.row[0])
        // }
    }catch(e){
        if(e.message === 'NotFound'){
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('unimplemented error handling')
        
    } finally{
        client && client.release()
    }
    
}