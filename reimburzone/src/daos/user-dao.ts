//get all users - admin, fm

import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserDTOtoUserConverter } from "../utils/UserDTO-to-User-converter";

export async function getAllUsers() {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select u."user_id", u."username", u."password" , u."first_name", u."last_name", u."email", r."role_id", r."role"
        from reimburzonedata.users u left join reimburzonedata.roles r on u."role" = r.role_id;`)
        return results.rows
    } catch (e) {
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//get users by ID -- admin, fm and current user

export async function findUserById(id: number) {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select u."user_id", u."username", u."password" , u."first_name", u."last_name", u."email", r."role_id", r."role"
        from reimburzonedata.users u left join reimburzonedata.roles r on u."role" = r.role_id where u.user_id = $1;`, [id])
        if (results.rowCount === 0) {
            throw new Error('User Not Found')
        } else {
            // return results.rows
            return UserDTOtoUserConverter(results.rows[0])
        }
    } catch (e) {
        if (e.message === 'Not Found') {
            throw new UserNotFoundError()
        }
        // console.log(e);
        throw new Error('Unimplemented Error Handling')

    } finally {
        client && client.release()
    }
}

//update user -- admin

//create user -- not part of the requirement but just adding it anyway

//logging in

