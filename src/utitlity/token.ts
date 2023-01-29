import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../accessories/configuration";


export const tokenGenerator = (user_id: string, role: string, email?:string, username?:string) => {
    let token: string = '';
    if (!email) {
        return token = jwt.sign({user_id, username, role}, JWT_SECRET, {expiresIn: '2h'})
    }
    else if(!username) {
        return token = jwt.sign({user_id, email, role}, JWT_SECRET, {expiresIn: '2h'})
    }
    else if (!email && !username) {
        return token = jwt.sign({user_id, role}, JWT_SECRET, {expiresIn: '2h'})
    }
}


export const verifyToken = (token: string, JWT_SECRET: string) => {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return decodedToken;
}