import express, { Request, Response, NextFunction } from 'express'
import { Reimbursement } from '../models/Reimbursement'
import { UserIdInputError } from '../errors/UserIdInputError'
import { UserNotFoundError } from '../errors/UserNotFoundError'

export let reimbursementRouter = express.Router()

reimbursementRouter.get('/', (req:Request, res:Response)=>{
    res.json(reimbursements)
})

reimbursementRouter.get('/author/userId/:id', (req:Request, res:Response, next:NextFunction) => {
    let {id} = req.params
    //if input is bad
    if(isNaN(+id)){ //if string
        throw new UserIdInputError()
    } else {
        let found = false;
        for(const reimbursement of reimbursements){
            if(reimbursement.author === +id){
                res.json(reimbursement)
                found = true
            }
        }
        if(!found){
            throw new UserNotFoundError()
        }
    }
    //if user doesnt exist

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
            status:'denied'
        },
        type:{
            typeId:2,
            type:'lodging'
        }
    },
    {
        reimbursementId:2,
        amount:444,
        author:4,
        dateSubmitted:2019,
        dateResolved:2020,
        description:'for book',
        resolver:2,
        status:{
            statusId:3,
            status:'approved'
        },
        type:{
            typeId:2,
            type:'book'
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