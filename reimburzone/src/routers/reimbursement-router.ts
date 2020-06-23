import express, { Request, Response } from 'express'
import { Reimbursement } from '../models/Reimbursement'

export let reimbursementRouter = express.Router()

reimbursementRouter.get('/', (req:Request, res:Response)=>{
    res.json(reimbursements)
})

reimbursementRouter.post('/', (req:Request, res:Response)=>{
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