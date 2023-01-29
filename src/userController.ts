import { RequestHandler } from "express";
import User from "./model/user.model";
import validator from "validator";
import bcrypt from 'bcrypt';
import { tokenGenerator } from "./utitlity/token";
import { generateOTP } from "./utitlity/otp";


type returnTodo = object | null;

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

    dbUser = await User.create({...req.body, email: reqbody.email.toLowerCase()})
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

export const logIn: RequestHandler = async(req, res, next) => {
    type tokenType = string | undefined;


    interface loginType {
        username: string;
        email: string;
        role: string;
        password: string
        id: string
    }
    let username: string;
    let password: string;
    let email: string;
try {
    
    const reqbody: loginType = req.body
    username = reqbody.username;
    email = reqbody.email;
    password = reqbody.password;

    if(!(username || email) && !password) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `All fields must be filled`
        })
    }

    let userDB: loginType | null = await User.findOne({$or: [{username}, {email}]})
    if (!userDB) {
        return res.status(404).json({
            status: `Success ...............`,
            message: `Invalid credentials !!!!!!`
        })
    }
    const match = await bcrypt.compare(password, userDB.password);
    
    if (!match) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Invalid email or password !!!!!!!!!`
        })
    }
    let otp = generateOTP(10)
    
    const token: tokenType = tokenGenerator(userDB.id, userDB.role, '', username)
    return res.status(200).json({
        status: `Success !!!!!`,
        message: `A one-time-pssword has been sent to your registered email address and phone number`,
        otp
    })
    
    
} catch (error: any) {
    res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
}

}