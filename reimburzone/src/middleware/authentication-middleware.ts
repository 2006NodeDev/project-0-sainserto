import { Request, Response, NextFunction } from "express";

export function authenticationMiddleware(req:Request, res:Response, next:NextFunction){
    if(!req.session.user){
        res.status(401).send('Please Log in')
    }else{
        console.log(`user ${req.session.user.username} has a role of ${req.session.user.role.role}`);
        next()
    }
}