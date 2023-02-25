import { RequestHandler } from 'express';
import Delivery  from '../model/doordelivery.model';


export const addDeliveryFee: RequestHandler = async(req, res, next) => {
    try {
        
        const {
                body: {state, deliveryFee}        
    } = req;

    if (!state) {
        return res.status(406).json({
            status: 'failed',
            message: `All field must be specified`
        })
    }
    const firstLetter = state[0].toUpperCase();
    const otherLetters = state.slice(1).toLowerCase();
    const joinStataeString = firstLetter+otherLetters;
    const dbDelivery = await  Delivery.findOne({state});

    if (dbDelivery) {
        return res.status(406).json({
            status: `failed`,
            message: `You already have a delivery detail for ${state}`
        })
    }

    const createdDelivery = await Delivery.create({state: joinStataeString, deliveryfee: deliveryFee});
    return res.status(201).json({
        status: `success`,
        message: `Delivery record successfully created`,
        deliveryDetails: createdDelivery
    })
    
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}

export const removeDeliveryFee: RequestHandler = async(req, res, next) => {
    try {
        const {params: {id}} = req;
        
        const deleteDelivery = await Delivery.findByIdAndDelete(id);

        if (deleteDelivery) {
            return res.status(406).json({
                status: `failed`,
                message: `Error deleting delivery record`
            })
        }
        return res.status(200).json({
            status: `success`,
            message: `Delivery record successfully removed from the database`
        })
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}

export const updateDeliveryFee: RequestHandler = async(req, res, next) => {
    try {
        
        const {params: {id},
                body: {state, deliveryfee}
    } = req;

        if(!(state || deliveryfee)){
            return res.status(406).json({
                status: `failed`,
                message: `Kindly specify the field to update`
            })
        }
        const firstLetter = state[0].toUpperCase();
        const otherLetters = state.slice(1).toLowerCase();
        const joinStataeString = firstLetter+otherLetters;
        const dbDelivery = await Delivery.findByIdAndUpdate({_id: id}, {state: joinStataeString, deliveryfee}, {new: true});
        if (!dbDelivery) {
            return res.status(500).json({
                status: `failed`,
                message: `Error updating the record`
            })
        }
        return res.status(200).json({
            status: `success`,
            message: `Delivery record successfully updated`,
            delivery: dbDelivery
        })

    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}





