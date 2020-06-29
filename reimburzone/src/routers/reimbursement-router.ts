import express, { Request, Response, NextFunction } from 'express'
import { Reimbursement } from '../models/Reimbursement'
import { UserIdInputError } from '../errors/UserIdInputError'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { StatusIdInputError } from '../errors/StatusIdInputError'
import { ReimbursementNotFoundError } from '../errors/ReimbursementNotFoundError'
// import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { getAllReimbursements, findReimbursementByUserId, findReimbursementByStatusId, saveOneReimbursement } from '../daos/reimbursement-dao'
import { ReimbursementInputError } from '../errors/ReimbursementInputError'

// import { ReimbursementStatus } from '../models/ReimbursementStatus'
// import { users } from './user-router'
// import { User } from '../models/User'

export let reimbursementRouter = express.Router()

//get all reimbursements -admin only

reimbursementRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    // res.json(reimbursements)
    try {
        let reimbursements = await getAllReimbursements()
        res.json(reimbursements)
    } catch (e) {
        next(e)
    }
})


//get reimbursement by user ... so all the reimbursements made by that user will show up
//order by date
//admin, fm, or if userId = user

//, authorizationMiddleware(['admin','finance-manager'])

reimbursementRouter.get('/author/userId/:id', async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    //if input is bad
    if (isNaN(+id)) { //if string
        throw new UserIdInputError()
    } else {
        try {
            let reimbursement = await findReimbursementByUserId(+id)
            res.json(reimbursement)
            // found = true
        } catch (e) {
            next(new UserNotFoundError())
        }
    }
    //if user doesnt exist

})

// get reimbursement by status... so all pending or all denied or all approved
//order by date
//admin and fm only
//, authorizationMiddleware(['admin','finance-manager'])

reimbursementRouter.get('/status/:statusId', async (req: Request, res: Response, next: NextFunction) => {
    let { statusId } = req.params
    //if input is bad
    if (isNaN(+statusId)) { //if string
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

//authorizationMiddleware(['admin','finance-manager','user']),

reimbursementRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // let{body} = req
    let {
        amount,
        dateSubmitted,
        dateResolved,
        resolver,
        status,
        type,
        description
    } = req.body

    if (!amount || !description) {
        console.log("somethings wrong with the input");

        next(new ReimbursementInputError)
    } else {
        let newReimbursement: Reimbursement = {
            reimbursementId: 0,
            author: req.session.user.userId,
            amount,
            dateSubmitted,
            dateResolved,
            resolver,
            status: {
                statusId: 0,
                status
            },
            type: {
                typeId: 0,
                type
            },
            description
        }
        newReimbursement.dateResolved = dateResolved || "1000-01-01"
        newReimbursement.type = type || null
        newReimbursement.resolver = resolver || null
        newReimbursement.status = status || "Pending"
        newReimbursement.dateSubmitted = dateSubmitted || (new Date().toLocaleDateString())


        try {
            let savedReimbursement = await saveOneReimbursement(newReimbursement)
            res.json(savedReimbursement)

        } catch (e) {
            next(e)
        }

    }
})


//update reimbursement
//admin and fm

reimbursementRouter.patch('/:id', async (req:Request, res:Response, next:NextFunction)=>{
    console.log(req.body);
    // let{body} = req
    let {
        amount,
        dateSubmitted,
        dateResolved,
        resolver,
        status,
        type,
        description
    } = req.body

    if (!status || !dateResolved) {
        console.log("somethings wrong with the input");

        next(new ReimbursementInputError)
    } else {
        let newReimbursement: Reimbursement = {
            reimbursementId: 0,
            author:0,
            amount,
            dateSubmitted,
            dateResolved,
            resolver: req.session.user.userId,
            status: {
                statusId: 0,
                status
            },
            type: {
                typeId: 0,
                type
            },
            description
        }
        newReimbursement.dateResolved = dateResolved || (new Date().toLocaleDateString())
        newReimbursement.type = type || null
        newReimbursement.resolver = resolver || null
        // newReimbursement.dateSubmitted = dateSubmitted || (new Date().toLocaleDateString())


        try {
            let savedReimbursement = await saveOneReimbursement(newReimbursement)
            res.json(savedReimbursement)

        } catch (e) {
            next(e)
        }

    }
})


// let reimbursements:Reimbursement[] = [
//     {
//         reimbursementId:1,
//         amount:333,
//         author:3,
//         dateSubmitted:2019,
//         dateResolved:2020,
//         description:'housing',
//         resolver:2,
//         status:{
//             statusId:3,
//             status:'denied'
//         },
//         type:{
//             typeId:1,
//             type:'lodging'
//         }
//     },
//     {
//         reimbursementId:2,
//         amount:444,
//         author:4,
//         dateSubmitted:2019,
//         dateResolved:2020,
//         description:'went to japan',
//         resolver:2,
//         status:{
//             statusId:2,
//             status:'approved'
//         },
//         type:{
//             typeId:2,
//             type:'travel'
//         }
//     }
// ]

// reimbursementId: number
//     author: number
//     amount: number
//     dateSubmitted: number
//     dateResolved: number
//     description: string
//     resolver: number
//     status: ReimbursementStatus
//     type: ReimbursementType
