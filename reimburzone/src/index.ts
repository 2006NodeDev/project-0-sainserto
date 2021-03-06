import express, { Request, Response, NextFunction } from 'express'
import { reimbursementRouter } from './routers/reimbursement-router'
import { userRouter} from './routers/user-router'
import { loggingMiddleware } from './middleware/logging-middleware'
import { sessionMiddleware } from './middleware/session-middleware'
import { BadCredentialsError } from './errors/BadCredentialsError'
import { getUserByUsernameAndPassword } from './daos/user-dao'

const app = express()
app.use(express.json())
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
