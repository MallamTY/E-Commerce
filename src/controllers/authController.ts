import bcrypt from 'bcrypt';
import { tokenGenerator, verifyToken } from "../utitlity/token";
import { generateOTP } from "../utitlity/otp";
import { RequestHandler } from "express";
import User from '../model/user.model';
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
    
    await sendOTP(userDB.email, userDB.username);

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
try {
    const {params: {token}} = req;
   
    
    if(!token) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Invalid link !!!!!!!!!`
        })
    }

    const payload: payload | JwtPayload |string | any  = verifyToken(token, JWT_SECRET);
    if (!payload) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Error completing this operation !!!!!!!!!`
        })
    }

    const {user_id, email, username} = payload;
    const getUser = await User.findById(user_id);

    if(!getUser) {
        return res.status(404).json({
            status: `Failed ...............`,
            message: `Link expired !!!!!!!!!`
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

    

}



// `Dear ${username},
//     To verify your email, click on this link: ${emailToken}
//     If you did not create an account, then ignore this email.`,