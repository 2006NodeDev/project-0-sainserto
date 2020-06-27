import express, { Request, Response, NextFunction } from 'express'
import { reimbursementRouter } from './routers/reimbursement-router'
import { userRouter} from './routers/user-router'
import { loggingMiddleware } from './middleware/logging-middleware'
import { sessionMiddleware } from './middleware/session-middleware'
import { BadCredentialsError } from './errors/BadCredentialsError'
// import { AuthFailureError } from './errors/AuthFailureError'
import { getUserByUsernameAndPassword } from './daos/user-dao'
// import { HttpError } from './errors/HttpErrors'

const app = express()

// app.use('/', (req, res) => {
//     res.send('Hello World')
// })
app.use(express.json())

//middleware
app.use(loggingMiddleware)
app.use(sessionMiddleware)

app.use('/reimbursements', reimbursementRouter)

app.use('/users', userRouter)

app.post('/login', async(req:Request, res:Response, next:NextFunction) => {
    let username = req.body.username
    let password = req.body.password
    if(!username && !password){
        throw new BadCredentialsError()
    } else {
        try{
            let user = await getUserByUsernameAndPassword(username,password)
            req.session.user = user
            res.json(user)
        }catch(e){
            next(e)
        }
        // let found = false
        // for(const user of users) {
        //     if(user.username === username && user.password === password){
        //         req.session.user = user
        //         res.json(user)
        //         found = true
        //     }
        // }
        // if(!found){
        //     throw new AuthFailureError()
        // }
    }
})

app.use((err,req,res,next) => { 
    if(err.statusCode){
        res.status(err.statusCode).send(err.message)
    } else {
        console.log(err);
        res.status(500).send('Oops, Something went wrong')
    }
})

app.listen(2006, () =>{
    console.log('Listening on port 2006');
})
