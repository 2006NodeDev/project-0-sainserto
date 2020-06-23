import express, { Request, Response } from 'express'
import { User } from './models/User' 
import { Reimbursement } from './models/Reimbursement'
const app = express()

// app.use('/', (req, res) => {
//     res.send('Hello World')
// })
app.use(express.json())

app.get('/users', (req:Request, res:Response)=>{
    res.json(users)
})

app.get('/reimbursements', (req:Request, res:Response)=>{
    res.json(reimbursements)
})

app.post('/users', (req:Request, res:Response)=>{
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

app.post('/reimbursements', (req:Request, res:Response)=>{
    console.log(req.body);
    let {
        reimbursementId,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
    } = req.body

        if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type){
            reimbursements.push({reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type})
            res.sendStatus(201)
        }else{
            res.status(400).send('Please Fill Out All Fields')
        }
    
})


app.listen(2006, () =>{
    console.log('Listening on port 2006');
})

let users:User[] = [
    {
        userId:1,
        username:'sainserto',
        password:'password',
        firstName:'Arlette',
        lastName:'Inserto',
        email:'sai@google.com',
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
        email:'bryle@google.com',
        role:{
            roleId:2,
            role:'finance-manager'
        }
    },
    {
        userId:3,
        username:'kyeo',
        password:'password',
        firstName:'Kyeo',
        lastName:'Leo',
        email:'kyeo@google.com',
        role:{
            roleId:3,
            role:'member'
        }
    }
]

let reimbursements:Reimbursement[] = [
    {
        reimbursementId:1,
        amount:333,
        author:3,
        dateSubmitted:2019,
        dateResolved:2020,
        description:'housing',
        resolver:2,
        status:{
            statusId:2,
            status:'resolved'
        },
        type:{
            typeId:2,
            type:'cash'
        }
    }
]
// reimbursementId: number
//     author: number
//     amount: number
//     dateSubmitted: number
//     dateResolved: number
//     description: string
//     resolver: number
//     status: ReimbursementStatus
//     type: ReimbursementType