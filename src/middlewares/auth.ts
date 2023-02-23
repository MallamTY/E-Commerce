import { RequestHandler } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { JWT_SECRET } from "../accessories/configuration";
import { verifyToken } from "../utitlity/token";
import { payloadJson } from "jsonwebtoken";

const Authentication: RequestHandler = (req, res, next) => {
    try {
        interface tokenType {
            id: string;
            email: string;
            username: string

        }
        type tokenT = string | JwtPayload | tokenType
        let {authorization} = req.headers
        if (!authorization) {
            return res.status(401).json({
                status: `Failed !!!!!`,
                message: `Authorization failed`
            })
        }
        const token = authorization.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                status: `Failed !!!!!`,
                message: `Authorization failed`
            })
        }
     
        const payload = <payloadJson>verifyToken(token);
        req.user = ({...payload})
        next()
        
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
    })
    }
}

export default Authentication;