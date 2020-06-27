//get all users - admin, fm

import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";

export async function getAllUsers(){
    let client: PoolClient
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select u."user_id", u."username", u."password" , u."first_name", u."last_name", u."email", r."role_id", r."role"
        from reimburzonedata.users u left join reimburzonedata.roles r on u."role" = r.role_id;`)
        return results.rows
    }catch(e){
        console.log(e);
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release()
    }
}

//get users by ID -- admin, fm and current user

//update user -- admin

//create user -- not part of the requirement but just adding it anyway

//logging in

