import express, { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { UserInputError } from '../errors/UserInputError'
import { UserIdInputError } from '../errors/UserIdInputError'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
// import { getAllReimbursements } from '../daos/reimbursement-dao'
import { getAllUsers } from '../daos/user-dao'

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
userRouter.get('/:id', authorizationMiddleware(['admin', 'finance-manager']), (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    //if input is bad
    if (isNaN(+id)) { //if string
        throw new UserIdInputError()
    } else {
        let found = false;
        for (const user of users) {
            if (user.userId == +id) {
                res.json(user)
                found = true
            }
        }
        if (!found) {
            throw new UserNotFoundError()
        }
    }
})

userRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
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

    if (userId && username && password && firstName && lastName && email && role) {
        users.push({ userId, username, password, firstName, lastName, email, role })
        res.sendStatus(201)
    } else {
        throw new UserInputError()
        // res.status(400).send('Please Fill Out All Fields')    
    }

    // res.sendStatus(501);
})



// userRouter.patch('/:id', authorizationMiddleware(['admin']), (req:Request, res:Response, next:NextFunction) =>{
//     
// })

export let users: User[] = [
    {
        userId: 1,
        username: 'sainserto',
        password: 'password',
        firstName: 'Arlette',
        lastName: 'Inserto',
        email: 'sai@gmail.com',
        role: {
            roleId: 1,
            role: 'admin'
        }
    },
    {
        userId: 2,
        username: 'bryle',
        password: 'password',
        firstName: 'Bryle',
        lastName: 'Peralta',
        email: 'bryle@gmail.com',
        role: {
            roleId: 2,
            role: 'finance-manager'
        }
    },
    {
        userId: 3,
        username: 'kyeoleo',
        password: 'password',
        firstName: 'Kyeo',
        lastName: 'Leo',
        email: 'kyeo@gmail.com',
        role: {
            roleId: 3,
            role: 'user'
        }
    }
]