import { json } from "body-parser";
import { RequestHandler } from "express";

export const  adminAuth: RequestHandler = (req, res, next) => {
    try {
        const currentUser = req.user

    if (!currentUser) {
        return next(res.status(401).json({
            status: 'Failed !!!!!!',
            message: 'Unauthorized access'
        }))
    }

    if (currentUser.role !== 'admin') {
        return next(res.status(401).json({
            status: 'Failed !!!!!!',
            message: 'Unauthorized access'
        }))
    }
    next()
    } catch (error: any) {
        return next(res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        }))
    }
}

