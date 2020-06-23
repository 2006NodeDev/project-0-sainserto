import express from 'express'
import { reimbursementRouter } from './routers/reimbursement-router'
import { userRouter } from './routers/user-router'

const app = express()

// app.use('/', (req, res) => {
//     res.send('Hello World')
// })
app.use(express.json())

app.use('/reimbursements', reimbursementRouter)

app.use('/users', userRouter)

app.listen(2006, () =>{
    console.log('Listening on port 2006');
})
