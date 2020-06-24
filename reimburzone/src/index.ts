import express from 'express'
import { reimbursementRouter } from './routers/reimbursement-router'
import { userRouter } from './routers/user-router'
// import { HttpError } from './errors/HttpErrors'

const app = express()

// app.use('/', (req, res) => {
//     res.send('Hello World')
// })
app.use(express.json())

app.use('/reimbursements', reimbursementRouter)

app.use('/users', userRouter)

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
