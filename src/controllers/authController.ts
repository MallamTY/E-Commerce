import bcrypt from 'bcrypt';
import { tokenGenerator, verifyToken } from "../utitlity/token";
import { generateOTP } from "../utitlity/otp";
import { RequestHandler } from "express";
import User from '../model/user.model';
import Token from '../model/token.model'
import { sendOTP } from '../utitlity/emailSender';
import { JWT_SECRET } from '../accessories/configuration';
import { JwtPayload } from 'jsonwebtoken';
//import MailService from '../utitlity/otpSender';



export const logIn: RequestHandler = async(req, res, next) => {
    type tokenType = string | undefined;

    interface loginType {
        username: string;
        email: string;
        role: string;
        password: string
        id: string,
        isEmailVerified: boolean
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

    if (userDB.isEmailVerified === false) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Account not verified yet, click on the verification link sent to your email !!!!!!!!!`
        })
    }
    
    const otp: string = generateOTP(10);
    const expires = new Date().getTime() + (60000 * 120)

    await sendOTP(userDB.email, userDB.username, otp);
    await Token.create({token: otp, user: userDB.id, expires, type: otp});

    return res.status(200).json({
        status: `Success !!!!!`,
        message: `A one-time-pssword has been sent to your registered email address ...`
    })
    
    
} catch (error: any) {
    return res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
}
 
}

export const verifyEmail: RequestHandler = async(req, res, next) => {

    interface payload {
        username: string;
        email: string;
        user_id: string;
    }

    interface dbObject {
        isEmailVerified: boolean
    }

try {
    const {params: {token}} = req;
    const payload: payload | JwtPayload |string | any  = verifyToken(token, JWT_SECRET);
    const dbToken: any = await Token.findOne({user: payload.user_id})
   
    if(!token) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Invalid link !!!!!!!!!`
        })
    }

    if (!payload) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Error completing this operation !!!!!!!!!`
        })
    }

    if (dbToken.expires < new Date()) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Expired link !!!!!!!!!`
        })
        
    }
    
    const {user_id, email, username} = payload;
    const dbUser: dbObject | any = await User.findById(user_id);
    if (dbUser.isEmailVerified === true) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Linked already used !!!!!!!!!`
        })
    }
    
    const verifiedUser = await User.findByIdAndUpdate({_id: user_id}, {isEmailVerified: true})

    return res.status(200).json({
        status: `Success ...............`,
        message: `Account verified .......`
    })

} catch (error: any) {
    return res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
}
};