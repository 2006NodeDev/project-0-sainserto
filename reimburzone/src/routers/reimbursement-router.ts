import express, { Request, Response, NextFunction} from 'express'
import { Reimbursement } from '../models/Reimbursement'
import { UserIdInputError } from '../errors/UserIdInputError'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { StatusIdInputError } from '../errors/StatusIdInputError'
import { ReimbursementNotFoundError } from '../errors/ReimbursementNotFoundError'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { getAllReimbursements, findReimbursementByUserId, findReimbursementByStatusId } from '../daos/reimbursement-dao'

export let reimbursementRouter = express.Router()

//get all reimbursements -admin only

reimbursementRouter.get('/', async (req:Request, res:Response, next:NextFunction)=>{
    // res.json(reimbursements)
    try{
        let reimbursements = await getAllReimbursements()
        res.json(reimbursements)
    } catch (e) {
        next(e)
    }
})

//add logged-in user authorization !!!!!! if they input their own user id. but if it's not theirs, then unauthorized.






reimbursementRouter.post('/', authorizationMiddleware(['admin','finance-manager','user']), (req:Request, res:Response)=>{
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

// reimbursementRouter.patch('/:id',authorizationMiddleware(['admin','finance-manager']), (req:Request, res:Response, next:NextFunction)=>{

// })

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
            statusId:3,
            status:'denied'
        },
        type:{
            typeId:1,
            type:'lodging'
        }
    },
    {
        reimbursementId:2,
        amount:444,
        author:4,
        dateSubmitted:2019,
        dateResolved:2020,
        description:'went to japan',
        resolver:2,
        status:{
            statusId:2,
            status:'approved'
        },
        type:{
            typeId:2,
            type:'travel'
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

//get reimbursement by user ... so all the reimbursements made by that user will show up
//order by date
//admin, fm, or if userId = user

//, authorizationMiddleware(['admin','finance-manager'])

reimbursementRouter.get('/author/userId/:id', async (req:Request, res:Response, next:NextFunction) => {
    let {id} = req.params
    //if input is bad
    if(isNaN(+id)){ //if string
        throw new UserIdInputError()
    } else {
        try {
            let reimbursement = await findReimbursementByUserId(+id)
            res.json(reimbursement)
            // found = true
        } catch (e) {
            next(new UserNotFoundError())
        }
        // let found = false;
        // for(const reimbursement of reimbursements){
        //     if(reimbursement.author === +id){
        //         res.json(reimbursement)
        //         found = true
        //     }
        // }
        // if(!found){
        //     throw new UserNotFoundError()
        // }
    }
    //if user doesnt exist

})

// get reimbursement by status... so all pending or all denied or all approved
//order by date
//admin and fm only
//, authorizationMiddleware(['admin','finance-manager'])

reimbursementRouter.get('/status/:statusId', async (req:Request, res:Response, next:NextFunction) => {
    let {statusId} = req.params
    //if input is bad
    if(isNaN(+statusId)){ //if string
        throw new StatusIdInputError()
    } else {

        try {
            let reimbursement = await findReimbursementByStatusId(+statusId)
            res.json(reimbursement)
            // found = true
        } catch (e) {
            next(new ReimbursementNotFoundError())
        }
    }
    //if user doesnt exist

})


//submit reimbursement
//everyone has access but 
//user should only submit reimbursementId, author, amount, datesubmitted, description, type
//fm and admin can edit and add dateresolved, resolver and status.


//update reimbursement
//admin and fm