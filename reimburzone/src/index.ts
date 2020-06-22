import express from 'express'
const app = express()

app.use('/', (req, res) => {
    res.send('Hello World')
})

app.listen(2006, () =>{
    console.log('Listening on port 2006');
})