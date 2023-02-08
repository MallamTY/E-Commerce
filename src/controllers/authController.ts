import bcrypt from 'bcrypt';
import { tokenGenerator } from "../utitlity/token";
import { generateOTP } from "../utitlity/otp";
import { RequestHandler } from "express";
import User from '../model/user.model';
import { sendEmail } from '../utitlity/otpSender';
//import MailService from '../utitlity/otpSender';



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

    let otp: string = generateOTP(10)
    await sendEmail(userDB.email, otp);
    
    return res.status(200).json({
        status: `Success !!!!!`,
        message: `A one-time-pssword has been sent to your registered email address ...`
    })
    
    
} catch (error: any) {
    res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
}
 
}