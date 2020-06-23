import express, { Request, Response } from 'express'
import { User } from '../models/User'

export let userRouter = express.Router()

userRouter.get('/users', (req:Request, res:Response)=>{
    res.json(users)
})

userRouter.post('/users', (req:Request, res:Response)=>{
    console.log(req.body);
    let {
        userId, 
        username, 
        password, 
        firstName, 
        lastName, 
        email, 
        role    
    } = req.body

        if(userId && username && password && firstName && lastName && email && role){
            users.push({userId, username, password, firstName, lastName, email, role})
            res.sendStatus(201)
        }else{
            res.status(400).send('Please Fill Out All Fields')    
        }

    // res.sendStatus(501);
})

let users:User[] = [
    {
        userId:1,
        username:'sainserto',
        password:'password',
        firstName:'Arlette',
        lastName:'Inserto',
        email:'sai@gmail.com',
        role:{
            roleId:1,
            role:'admin'
        }
    },
    {
        userId:2,
        username:'bryle',
        password:'password',
        firstName:'Bryle',
        lastName:'Peralta',
        email:'bryle@gmail.com',
        role:{
            roleId:2,
            role:'finance-manager'
        }
    },
    {
        userId:3,
        username:'kyeoleo',
        password:'password',
        firstName:'Kyeo',
        lastName:'Leo',
        email:'kyeo@gmail.com',
        role:{
            roleId:3,
            role:'member'
        }
    }
]