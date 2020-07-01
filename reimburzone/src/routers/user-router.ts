import express, { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { UserInputError } from '../errors/UserInputError'
import { UserIdInputError } from '../errors/UserIdInputError'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { getAllUsers, findUserById, saveOneUser, updateUser } from '../daos/user-dao'
import { UserNotFoundError } from '../errors/UserNotFoundError'

export let userRouter = express.Router()
userRouter.use(authenticationMiddleware)

// get ALL users -- admin, fm
userRouter.get('/', authorizationMiddleware(['admin', 'finance-manager']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let allUsers = await getAllUsers()
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//get User by id -- admin, fm, current user if theyre looking for themselves
userRouter.get('/:id', authorizationMiddleware(['admin', 'finance-manager', 'user']), async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        next(new UserIdInputError())
    } else if (req.session.user.role.role === 'finance-manager' || req.session.user.role.role === 'admin') {
        try {
            let user = await findUserById(+id)
            res.json(user)
        } catch (e) {
            next(new UserNotFoundError())
        }
    } else if (req.session.user.role.role === 'user') {
        try {
            let user = await findUserById(+id)
            if (req.session.user.userId === user.userId) {
                res.json(user)
            } else {
                res.status(401).send('The incoming token has expired')
            }
        } catch (e) {
            next(new UserNotFoundError)
        }
    }
})

//admin only!!!!! 
userRouter.post('/', authorizationMiddleware(['admin']), async (req: Request, res: Response, next: NextFunction) => {

    let { username, password, firstName, lastName, email, role } = req.body
    if (!username || !password || !firstName || !lastName || !email || !role) {
        next(new UserInputError)
    } else {
        let newUser: User = {
            username,
            password,
            firstName,
            lastName,
            email,
            role,
            userId: 0
        }

        try {
            let savedUser = await saveOneUser(newUser)
            res.sendStatus(201).json(savedUser)
        } catch (e) {
            next(new UserInputError)
        }
    }
})



userRouter.patch('/', authorizationMiddleware(['admin']), async (req: Request, res: Response, next: NextFunction) => {

    let { username, password, firstName, lastName, email, role } = req.body
    let newUser: User = {
        userId: req.body.userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role
    }
    let id = newUser.userId
    if (isNaN(id)) {
        next(new UserIdInputError)
    }
    try {
        let savedUser = await updateUser(id, newUser)
        res.json(savedUser).sendStatus(201)
    } catch (e) {
        console.log(e)
        next(e)
    }
})