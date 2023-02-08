import { RequestHandler } from "express";
import User from "../model/user.model";
import validator from "validator";
import { uploads } from "../utitlity/cloudinary";


export type returnTodo = object | null;

export const registerUser: RequestHandler = async(req, res, next) => {
    
   try {
    let reqbody: {
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        password: string;
        confirmpassword: string;
    }

    reqbody = req.body
    



    if (!(reqbody.firstname && reqbody.lastname && req.body.username && reqbody.email && reqbody.password && reqbody.confirmpassword)) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `All fields must be fieled`
        })
    }
    if (!validator.isEmail(reqbody.email)) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Invalid email address supplied`
        })
    }
    if (!validator.isStrongPassword(reqbody.password) && !validator.isStrongPassword(reqbody.confirmpassword)) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Password not strong enough !!!!!`
        })
    }
    if (reqbody.password !== reqbody.confirmpassword) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Password not match !!!!`
        })
    }

    let dbUser: returnTodo = await User.findOne({$or: [{email: reqbody.email.toLowerCase()}, {username: reqbody.username}]});

    if (dbUser) {
        return res.status(404).json({
            status: `Failed !!!!!`,
            message: `User already exist in our database !!!!`
        })
    }
    const cloudImage = await uploads(req,'Users');
    const {public_id, url, secure_url} = cloudImage;
 

    dbUser = await User.create({...req.body, email: reqbody.email.toLowerCase(), 
        profilepicture_public_url: public_id, profilepicture_secure_url: secure_url,
        profilepicture_url: url
    })
    return res.status(201).json({
        status: `Success !!!!!`,
        message: `Account successfully created !!!!`,
        user: dbUser
    })
    
   } catch (error: any) {
    res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        error: error.message
    })
   }
}
