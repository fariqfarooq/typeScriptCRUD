import express from 'express'
import { deleteUserById,  getUserById, getUsers } from '../models/user'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = getUsers();
        const serializedUsers = (await users).map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
        }))
        res.status(200).json(serializedUsers)

    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }

}

export const deleteUser = async(req:express.Request, res: express.Response)=>{
    try {
        
        const { id } = req.params;
        // console.log('heree')
        const deletedUser = await deleteUserById(id)
        console.log('this is deleted user',deletedUser)
        return res.status(200).json(deletedUser)
   
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
}

export const updateUser = async(req:express.Request, res: express.Response)=>{
    try {
        const {id} = req.params;
        const { username } = req.body;

        if(!username){
            res.sendStatus(400)
        }
        const user = await getUserById(id);
        if(!user){
            return res.sendStatus(403)
        }
      
      user.username = username;
      user.save()
      
      console.log('======',user)
        return res.status(200).json(user).end()

        
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
}