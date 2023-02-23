import Cart from "../model/cart.model";
import { RequestHandler } from "express";
import Product from "../model/product.model";
import Delivery from "../model/doordelivery.model";


export const checkout: RequestHandler = async(req, res, next) => {
    try {
        const {user: {user_id},
                body: {pickup_station, doordelivery, state}
    } = req;

    const cart: any = await Cart.findOne({customer: user_id});

    if (!(pickup_station || doordelivery)) {
        return res.status(406).json({
            status: `failed`,
            message: `Delivery method must be specified`
        })
    }

    if (pickup_station) {
        function deliverFeeCalc(deliveryFees: Array<number>): number {
            return deliveryFees.reduce(function(firstVal, currentVal) {
                  return firstVal + currentVal
              })
             
          }
          
            const productShippingFee: Array<number> = [];
            
            for (const product of cart.products) {
                const fetchedProduct: any = await Product.findById(product.product)
                const totalQuantity = product.totalProductQuantity;
                const deliveryFee = fetchedProduct?.deliveryfee;
                const totalDeliveryFee = totalQuantity * deliveryFee;
                productShippingFee.push(totalDeliveryFee) ;
            }
    
            const shippingFee: number = deliverFeeCalc(productShippingFee);
            return res.status(200).json({
                status: `success`,
                shippingFee
            })
    }
    else if(doordelivery){
        if (!state) {
            return res.status(406).json({
                status: `failed`,
                message: `Delivery address must be specified`
            })
        }
        const stateDelivery = await Delivery.findOne({state});
        const deliveryFee: number | undefined = stateDelivery?.deliveryfee;
        return res.status(200).json({
            status: `success`,
            deliveryFee
        })
    }
        
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}