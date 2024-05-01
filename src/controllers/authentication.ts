import express from 'express'
import { getUserByEmail, createUser } from '../models/user';
import { authentication, random } from '../helpers/';

export const login = async(req: express.Request, res: express.Response)=>{
  try {
    const {email, password} = req.body;
  if(!email || !password){
    return res.sendStatus(400)
  }
  const user  = await getUserByEmail(email).select('authentication.salt +authentication.password');
  if(!user){
    return res.sendStatus(400)
  }
  const expectedHash = authentication(user.authentication?.salt as string, password)

  if(user.authentication?.password as string !== expectedHash){
       return res.sendStatus(403)
   }

   const salt = random()
   if(user.authentication){
     user.authentication.sessionToken = authentication(salt, user._id.toString());
   }

    // let userSession = user.authentication?.sessionToken as string  ; 
    // userSession = authentication(salt, user._id.toString());
    await user.save();
    console.log(user);

    res.cookie('fariq-auth', user.authentication?.sessionToken, {domain:'localhost', path:'/'});
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
  }
  
}


export const register = async(req: express.Request, res: express.Response) =>{
    try {
     
      const { email, password, username} = req.body;
      
      if(!email || !password || !username){
        console.log('missing cred');
        return res.sendStatus(400);
      }

      const existingUser = await getUserByEmail(email);
      if(existingUser){
        console.log('user already exists');
        return res.sendStatus(400)
      }

      const salt = random();
      const user = await createUser({
        email,
        username,
        authentication:{
            salt,
            password: authentication(salt, password)
        }
      })
      console.log(user, 'user created successfully')
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}