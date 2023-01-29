import { RequestHandler } from "express";


export const vendorAuth: RequestHandler = (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser.role) {
        return next(res.status(401).json({
            status: 'Failed !!!!!!!!',
            message: 'Unauthorized access'
        }))
    }

    if (currentUser.role !== 'vendor') {
        return next(res.status(401).json({
            status: 'Failed !!!!!!!!',
            message: 'Unauthorized access'
        }))
    }

    next();

}