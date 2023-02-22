import { RequestHandler } from "express";


const vendorAuth: RequestHandler = (req, res, next) => {
    
    try {
        const currentUser = req.user;
        if (!currentUser.role) {
            return res.status(401).json({
                status: 'Failed !!!!!!!!',
                message: 'Unauthorized access'
            })
        }
    
        if (currentUser.role !== 'vendor') {
            return res.status(401).json({
                status: 'Failed !!!!!!!!',
                message: 'Unauthorized access'
            })
        }
    next();
    } catch (error: any) {
        return res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
    })
    }
   
}

export default vendorAuth