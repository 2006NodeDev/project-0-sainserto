import express, { Request, Response, NextFunction} from 'express'
import { User } from '../models/User'
import { UserInputError } from '../errors/UserInputError'
import { UserIdInputError } from '../errors/UserIdInputError'
import { UserNotFoundError } from '../errors/UserNotFoundError'

export let userRouter = express.Router()

userRouter.get('/', (req:Request, res:Response, next:NextFunction)=>{
    res.json(users)
})

userRouter.post('/', (req:Request, res:Response, next:NextFunction)=>{
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
            throw new UserInputError()
            // res.status(400).send('Please Fill Out All Fields')    
        }

    // res.sendStatus(501);
})

userRouter.get('/:id', (req:Request, res:Response, next:NextFunction) => {
    let {id} = req.params
    //if input is bad
    if(isNaN(+id)){ //if string
        throw new UserIdInputError()
    } else {
        let found = false;
        for(const user of users){
            if(user.userId == +id){
                res.json(user)
                found = true
            }
        }
        if(!found){
            throw new UserNotFoundError()
        }
    }
})

// userRouter.patch('/:id', (req:Request, res:Response, next:NextFunction) =>{
//     let {id} = req.params
//     //if input is bad
//     if(isNaN(+id)){ //if string
//         throw new UserIdInputError()
//     } else {
//         let found = false;
//         for(const user of users){
//             if(user.userId == +id){
//                 console.log(req.body);
//                 // Comment.update({ comment: req.body.comment }, { where: { id: req.params.id } })
//                 // .then((result) => {
//                 //   res.json(result);
//                 // })
      
//                 let {
//                     userId = +id, 
//                     username, 
//                     password, 
//                     firstName, 
//                     lastName, 
//                     email, 
//                     role    
//                 } = req.body
//                 users.push({userId, username, password, firstName, lastName, email, role})
                
//                 res.json(user)
//                 found = true
//             }
//         }
//         if(!found){
//         throw new UserNotFoundError()
//         }
//     }
// })

export let users:User[] = [
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
            role:'user'
        }
    }
]