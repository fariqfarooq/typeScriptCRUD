import express from 'express';
import {get,  identity,  merge} from 'lodash'

import { getUserBySessionToken } from '../models/user';




export const isAuthenticated = async( req:express.Request, res: express.Response, next:express.NextFunction) =>{
   try {

    const sessionToken = req.cookies['fariq-auth'];
    if(!sessionToken){
        res.sendStatus(403)
    }
    // console.log('hereee')

    const existingUser = await getUserBySessionToken(sessionToken);
    console.log(sessionToken)
    if(!existingUser){
        res.sendStatus(403)
        
    }
    merge(req, {identity: existingUser})
    return next()
    
    
   } catch (error) {
    console.log(error)
    res.sendStatus(403)
   }
}

export const isOwner = async(req: express.Request, res: express.Response, next:express.NextFunction) =>{
    try {
     const { id } = req.params;
     console.log('req ====>', req)
     const currentUserId = get(req, 'identity._id') ?? '' as string;

     console.log('currentUserId =====', currentUserId)
     if(!currentUserId){
         res.sendStatus(403)
     }
     if(currentUserId.toString() !== id){
     res.sendStatus(403)
     }
     next()
    } catch (error) {
     console.log(error)
     res.sendStatus(400)
    }
     
 }