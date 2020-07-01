import express, { Request, Response, NextFunction } from 'express'
import { Reimbursement } from '../models/Reimbursement'
import { UserIdInputError } from '../errors/UserIdInputError'
import { StatusIdInputError } from '../errors/StatusIdInputError'
import { ReimbursementNotFoundError } from '../errors/ReimbursementNotFoundError'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { getAllReimbursements, findReimbursementByUserId, findReimbursementByStatusId, saveOneReimbursement, updateReimbursement } from '../daos/reimbursement-dao'
import { ReimbursementInputError } from '../errors/ReimbursementInputError'
import { ReimbursementIdInputError } from '../errors/ReimbursementIdInputError'
import { UserHasNoReimbursementError } from '../errors/UserHasNoReimbursementError'
import { authenticationMiddleware } from '../middleware/authentication-middleware'


export let reimbursementRouter = express.Router()
reimbursementRouter.use(authenticationMiddleware)


//get all reimbursements -admin only
reimbursementRouter.get('/', authorizationMiddleware(['admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let reimbursements = await getAllReimbursements()
        res.json(reimbursements)
    } catch (e) {
        next(e)
    }
})


//get reimbursement by user
//admin, fm, or if userId = user

reimbursementRouter.get('/author/userId/:id', authorizationMiddleware(['admin', 'finance-manager', 'user']), async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    //if input is bad
    if (isNaN(+id)) { //if string
        next(new UserIdInputError())
    } else if (req.session.user.role.role === 'finance-manager' || req.session.user.role.role === 'admin') {
        try {
            let reimbursement = await findReimbursementByUserId(+id)
            res.json(reimbursement)
        } catch (e) {
            next(new UserHasNoReimbursementError())
        }
    } else if(req.session.user.role.role === 'user') {
        try {
            let reimbursement = await findReimbursementByUserId(+id)
            if (req.session.user.userId === +id) {
                res.json(reimbursement)
            } else {
                res.status(401).send('The incoming token has expired')
            }
        } catch (e) {
            next(new UserHasNoReimbursementError)
        }
    }
})

// get reimbursement by status... so all pending or all denied or all approved
//admin and fm only

reimbursementRouter.get('/status/:statusId', authorizationMiddleware(['admin', 'finance-manager']), async (req: Request, res: Response, next: NextFunction) => {
    let { statusId } = req.params
    if (isNaN(+statusId)) {
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
})

//submit reimbursement
reimbursementRouter.post('/', authorizationMiddleware(['admin', 'finance-manager', 'user']), async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
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
        newReimbursement.dateResolved = dateResolved || "0001-01-01"
        newReimbursement.type = type || null
        newReimbursement.resolver = resolver || null
        newReimbursement.status = status || "Pending"
        newReimbursement.dateSubmitted = dateSubmitted || (new Date().toDateString())
        try {
            let savedReimbursement = await saveOneReimbursement(newReimbursement)
            res.json(savedReimbursement).sendStatus(201)

        } catch (e) {
            next(e)
        }
    }
})

//update reimbursement; admin and fm
reimbursementRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    let {
        author,
        amount,
        dateSubmitted,
        dateResolved,
        status,
        type,
        description
    } = req.body
    if (!status) {
        next(new ReimbursementInputError)
    } else {
        let newReimbursement: Reimbursement = {
            reimbursementId: req.body.reimbursementId,
            author,
            amount,
            dateSubmitted,
            dateResolved,
            resolver: req.session.user.userId,
            status,
            type,
            description
        }

        newReimbursement.status = status || "Pending"
        newReimbursement.dateResolved = dateResolved || (new Date().toDateString())
        const id = newReimbursement.reimbursementId
        if (isNaN(id)) {
            next(new ReimbursementIdInputError)
        }
        try {
            let savedReimbursement = await updateReimbursement(id, newReimbursement)
            res.json(savedReimbursement).sendStatus(201)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
})