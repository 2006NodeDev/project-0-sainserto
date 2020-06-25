import session, { SessionOptions } from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret', //you should use a hash instead not this
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig)


