import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Delivery  from '../model/doordelivery.model';


class DeliverController {
    constructor() {
    }
    

    public addDeliveryFee: RequestHandler = async(req, res, next) => {
        try {
            
            const {
                    body: {state, deliveryfee}        
        } = req;

        if (!state) {
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                status: 'failed',
                message: `All field must be specified`
            })
        }
        const firstLetter = state[0].toUpperCase();
        const otherLetters = state.slice(1).toLowerCase();
        const joinStataeString = firstLetter+otherLetters;
        const dbDelivery = await  Delivery.findOne({state: joinStataeString});

        if (dbDelivery) {
            return res.status(StatusCodes.CONFLICT).json({
                status: `failed`,
                message: `You already have a delivery detail for ${joinStataeString}`
            })
        }

        const createdDelivery = await Delivery.create({state: joinStataeString, deliveryfee});
        return res.status(StatusCodes.CREATED).json({
            status: `success`,
            message: `Delivery record successfully created`,
            deliveryDetails: createdDelivery
        })
        
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    }

    public removeDeliveryFee: RequestHandler = async(req, res, next) => {
        try {
            const {params: {id}} = req;
            
            const deleteDelivery = await Delivery.findByIdAndDelete(id);

            if (!deleteDelivery) {
                return res.status(StatusCodes.FAILED_DEPENDENCY).json({
                    status: `failed`,
                    message: `Error deleting delivery record`
                })
            }
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Delivery record successfully removed from the database`
            })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    }

   public updateDeliveryFee: RequestHandler = async(req, res, next) => {
        try {
            
            const {params: {id},
                    body: {deliveryfee}
        } = req;

            if(!deliveryfee){
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Kindly specify the field to update`
                })
            }
            
            else {
            const dbDelivery = await Delivery.findByIdAndUpdate({_id: id}, {deliveryfee}, {new: true});
            if (!dbDelivery) {
                return res.status(StatusCodes.FAILED_DEPENDENCY).json({
                    status: `failed`,
                    message: `Error updating the record`
                })
            }
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Delivery record successfully updated`,
                delivery: dbDelivery
            })
            }
            
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    }

}

export default new DeliverController();