import bcrypt from 'bcrypt';
import { tokenGenerator, verifyToken, emailTokenGenerator } from "../utitlity/token";
import { generateOTP } from "../utitlity/otp";
import { RequestHandler } from "express";
import User from '../model/user.model';
import Token from '../model/token.model'
import { sendOTP, sendResetPasswordLink, sendVerificationLink } from '../utitlity/emailSender';
import { JwtPayload } from 'jsonwebtoken';
import validator from 'validator';
import { JWT_SECRET } from '../accessories/configuration';



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
                status: `failed !!!!!`,
                message: `All fields must be filled`
            })
        }

        let userDB: loginType | null = await User.findOne({$or: [{username}, {email}]})
        if (!userDB) {
            return res.status(404).json({
                status: `success`,
                message: `Invalid credentials !!!!!!`
            })
        }
        const match = await bcrypt.compare(password, userDB.password);
        
        if (!match) {
            return res.status(404).json({
                status: `failed`,
                message: `Invalid email or password !!!!!!!!!`
            })
        }

        if (userDB.isEmailVerified === false) {
            return res.status(404).json({
                status: `failed`,
                message: `Account not verified yet, click on the verification link sent to your email !!!!!!!!!`
            })
        }
        
        const otp: string = generateOTP(10);
        const expires = Date.now() + 300000;

        await sendOTP(userDB.email, userDB.username, otp);
        await Token.create({token: otp, user: userDB.id, expires, type: 'Login OTP'});

        return res.status(200).json({
            status: `success`,
            message: `A one-time-password has been sent to your registered email address ...`,
            otp
        })
        
    
} catch (error: any) {
    return res.status(500).json({
        status: `failed`,
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
        const dbToken: any = await Token.findOne({user: payload.user_id, type: 'Verification Link'})
    
        if(!token) {
            return res.status(404).json({
                status: `failed`,
                message: `Invalid link !!!!!!!!!`
            })
        }

        if (!payload) {
            return res.status(404).json({
                status: `failed`,
                message: `Error completing this operation !!!!!!!!!`
            })
        }

        if (!dbToken) {
            return res.status(404).json({
                status: `failed`,
                message: `Expired link !!!!!!!!!`
            })
            
        }
        
        const {user_id} = payload;
        const dbUser: dbObject | any = await User.findById(user_id);
        if (dbUser.isEmailVerified === true) {
            return res.status(404).json({
                status: `failed`,
                message: `Linked already used !!!!!!!!!`
            })
        }
        
        await User.findByIdAndUpdate({_id: user_id}, {isEmailVerified: true})

        return res.status(200).json({
            status: `success`,
            message: `Account verified .......`
        })

} catch (error: any) {
    return res.status(500).json({
        status: `failed`,
        message: error.message
    })
}
};

export const resendEmailVerificiationLink:RequestHandler = async(req, res, next) => {
    try {
        const {params: {token}} = req;
        const payload: any = verifyToken(token);

        const newToken: string | undefined = emailTokenGenerator(payload.id, payload.email, payload.username);
        const expires: Date | number =  Date.now() + 300000;
        await Token.create({token, user: payload.id, expires, type: 'Verification Link'})
        await sendVerificationLink(payload.email, payload.username, newToken);

        return res.status(200).json({
            status: `success`,
            message: `Verification link has been resent to ${payload.email}`
        })
    
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        }) 
    }
}
export const verifyOTP: RequestHandler = async(req, res, next) => {

    try {

        const {params: {user_id},
                body: {otp}
                                } = req;
        if (!user_id) {
            return res.status(404).json({
                status: `failed`,
                message: `Invalid credentials !!!!!!!!!`
            })
        }
    
        const dbToken = await Token.findOne({user: user_id, type: 'Login OTP'});
        
        if(dbToken) {
            if (dbToken?.token === otp) {
                if (dbToken?.valid) {
                    const loginUser: any = await User.findById(user_id);
                    const token: string = tokenGenerator(user_id, loginUser.role, loginUser.email, loginUser.username);
     
                    if (token) {
                        dbToken.valid = false;
                        dbToken.save();
                        return res.status(200).json({
                            status: `success`,
                            message: `Login successful ..........`,
                            token
                        })
                }

                return res.status(404).json({
                    status: `failed`,
                    message: `Unable to generate login token !!!`
                })

            }
            return res.status(404).json({
                status: `failed`,
                message: `Invalid one-time-password !!!`,
            })
            
        }
        return res.status(404).json({
            status: `failed`,
            message: `Invalid one-time-password !!!`,
        })
    }
    return res.status(404).json({
        status: `failed`,
        message: `Your one-time-password has expired !!!`,
    });

    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }

}

export const resendOTP: RequestHandler = async(req, res, next) => {
    try {
        const {params: {user_id},
                        } = req;
        
        const userDB: any = await User.findById(user_id)
        const otp = generateOTP(10);
        
        const dbOTP = await Token.findOne({user: user_id, type: 'Login OTP'});
        
        
        if(dbOTP) {
            const expires = Date.now() + 300000;
            await sendOTP(userDB.email, userDB.username, otp);
            await Token.findByIdAndUpdate(dbOTP.id, {token: otp, expires}); 

            return res.status(200).json({
                status: `success`,
                message: `A one-time-pssword has been resent to your registered email address ...`
            });
        }

        const expires = Date.now() + 300000;
        await sendOTP(userDB.email, userDB.username, otp);
        await Token.create({token: otp, user: user_id, expires, type: 'Login OTP'});
        
        return res.status(200).json({
            status: `success`,
            message: `A one-time-pssword has been resent to your registered email address ...`,
            otp
        });

    } catch (error: any) {
        return next(res.status(500).json({
            status: `failed`,
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

        const dbToken = await Token.findOne({user: dbUser.id, type: 'Password Reset'});
        
        if (dbToken) {
            const expires = Date.now() + 300000;
            sendResetPasswordLink(dbUser.email, dbUser.username, token);
            await Token.findByIdAndUpdate(dbToken.id, {token, expires});
        
            return res.status(200).json({
                status: `success`,
                message: `A password reset link has been resent to ${dbUser.email}`
            });
             
        }
        const expires = Date.now() + 300000;
        sendResetPasswordLink(dbUser.email, dbUser.username, token);
        await Token.create({token, user: dbUser.id, expires, type: 'Password Reset'});

        return res.status(200).json({
            status: `success`,
            message: `A password reset link has been sent to ${dbUser.email}`
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
                                
            const validityCheck: any = await Token.findOne({user: user_id, type: 'Password Reset'});
            console.log(validityCheck);
            

            if (!validityCheck) {
                return res.status(406).json({
                    status: `Failed !!!!!!!!!!!!`,
                    message: `Invalid link !!!`
                });
            }

            if (validityCheck.valid === false) {
                return res.status(406).json({
                    status: `Failed !!!!!!!!!!!!`,
                    message: `Invalid link !!!`
                });
            }

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
            
            if (validityCheck.token !== token) {
                return res.status(406).json({
                    status: `Failed !!!!!!!!!!!!`,
                    message: `Invalid link !!!`
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

            const updatedToken = await Token.findOneAndUpdate({id: user_id, type: 'Password Reset'}, {valid: false});

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