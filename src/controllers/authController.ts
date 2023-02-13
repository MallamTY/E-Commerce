import bcrypt from 'bcrypt';
import { tokenGenerator, verifyToken, emailTokenGenerator } from "../utitlity/token";
import { generateOTP } from "../utitlity/otp";
import { RequestHandler } from "express";
import User from '../model/user.model';
import Token from '../model/token.model'
import { sendEmail, sendOTP, sendResetPasswordLink } from '../utitlity/emailSender';
import jwt, { JwtPayload } from 'jsonwebtoken';
import validator from 'validator';



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
    const payload: payload | JwtPayload |string | any  = verifyToken(token);
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


export const verifyOTP: RequestHandler = async(req, res, next) => {

    try {

        const {params: {user_id},
                body: {otp}
                                } = req;
        if (!user_id) {
            return res.status(404).json({
                status: `Failed ...............`,
                message: `Invalid credentials !!!!!!!!!`
            })
        }
    
        const dbToken = await Token.findOne({user: user_id});
    
        if (dbToken?.token === otp) {
            if (dbToken?.valid) {
                const currentTIme = new Date();
                if (dbToken.expires > currentTIme) {
                    const loginUser: any = await User.findById(user_id);
                    const token = tokenGenerator(user_id, loginUser.role, loginUser.email, loginUser.username);
                    if (token) {
                        dbToken.valid = false;
                        dbToken.save();
                        return next(res.status(200).json({
                            status: `Success .....`,
                            message: `Login successful ..........`,
                            token
                        }))
                    }
                    return next(res.status(404).json({
                        status: `Failed !!!`,
                        message: `Unable to generate login token !!!`
                    }))
                }
                return next(res.status(404).json({
                    status: `Failed !!!`,
                    message: `Your one-time-password has expired !!!`,
                }))
            }
            return next(res.status(404).json({
                status: `Failed !!!`,
                message: `Invalid one-time-password !!!`,
            }))
        }
        return next(res.status(404).json({
            status: `Failed !!!`,
            message: `Invalid one-time-password !!!`,
        }))
    } catch (error: any) {
        return next(res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        }))
    }

}

export const resendOTP: RequestHandler = async(req, res, next) => {
    try {
        const {params: {user_id},
                        } = req;
        
        const userDB: any = await User.findById(user_id)
        const otp = generateOTP(10);

        const expires = new Date().getTime() + (60000 * 120)

        await sendOTP(userDB.email, userDB.username, otp);
        await Token.updateMany({user: user_id}, {$set: {"valid": false}});
        await Token.create({token: otp, user: userDB.id, expires, type: otp});
        
        return res.status(200).json({
            status: `Success !!!!!`,
            message: `A one-time-pssword has been resent to your registered email address ...`
        });

    } catch (error: any) {
        return next(res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        }))
    }
}

export const forgetPassword: RequestHandler = async(req, res, next) => {

    try {
        const {body: {email, username}} = req;
        if(!validator.isEmail(email)) {
            return res.status(406).json({
                status: `Failed !!!!!!!!!!!!`,
                message: `Invalid email address !!!`
            })
        }

        const dbUser = await User.findOne({$or: [{email: email. toLowerCase()}, {username}]});

        if (!dbUser) {
            return res.status(406).json({
                status: `Failed !!!!!!!!!!!!`,
                message: `User not found !!!`
            })
        }

        const token = emailTokenGenerator(dbUser.id, dbUser.role, dbUser.email);

        if (!token) {
            return res.status(500).json({
                status: `Failed !!!!!!!!!!!!`,
                message: `Unable to generate token !!!`
            })
        }

        sendResetPasswordLink(dbUser.email, dbUser.username, token)

        return res.status(200).json({
            status: `Success ....`,
            message: `A password rest link has been sent to ${dbUser.email}`
        });

    } catch (error: any) {
        return res.status(406).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        })
    }
}

export const resetPassword: RequestHandler = async(req, res, next) => {

    try {


            const {body: {newPassword, confirmNewPassword},
            params: {token}
                                } = req;
    const payload: any = verifyToken(token)
    const user_id = payload.user_id;

    
    if (!validator.isStrongPassword(newPassword || !validator.isStrongPassword(confirmNewPassword))) {
        return res.status(406).json({
            status: `Failed !!!!!!!!!!!!`,
            message: `Password not strong enough !!!`
        });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(406).json({
            status: `Failed !!!!!!!!!!!!`,
            message: `Password not match`
        });
    }
    
    const updateUser = await User.findById(user_id);
   
    if (!updateUser) {
        return res.status(406).json({
            status: `Failed !!!!!!!!!!!!`,
            message: `Unabale to change your password this time !!!`
        });
    }

    updateUser.password = newPassword;
    updateUser.confirmpassword = confirmNewPassword;
    updateUser.save();

    return res.status(200).json({
        status: `Success !!!`,
        message: `Password reset successful ...`
    })
    } catch (error: any) {
        return res.status(500).json({
            status: `Failed !!!`,
            message: error.message
        })
    }
}