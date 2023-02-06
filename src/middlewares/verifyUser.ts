import { RequestHandler } from "express";


const buyerAuth: RequestHandler = (req, res, next) => {
    
    try {
        const currentUser = req.user;
        if (!currentUser.role) {
            return next(res.status(401).json({
                status: 'Failed !!!!!!!!',
                message: 'Unauthorized access'
            }))
        }
    
        if (currentUser.role !== 'user') {
            return next(res.status(401).json({
                status: 'Failed !!!!!!!!',
                message: 'Unauthorized access'
            }))
        }

        next();
    } catch (error: any) {
        return next(res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
    }))
    } 
}


export default buyerAuth;