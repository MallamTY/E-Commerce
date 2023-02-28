import Cart from "../model/cart.model";
import { RequestHandler } from "express";
import Product from "../model/product.model";
import Delivery from "../model/doordelivery.model";
import Order from "../model/order.model";


export const checkout: RequestHandler = async(req, res, next) => {
    try {
        const {user: {user_id},
                body: {pickup_station, doordelivery, state, contact_person_name,
                contact_person_phone, shipping_method, payment_method}
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
            const productDetails: Array<Array<String>> = [[]]
            
            for (const product of cart.products) {
                const fetchedProduct: any = await Product.findById(product.product)
                const totalQuantity = product.totalProductQuantity;
                const deliveryFee = fetchedProduct?.deliveryfee;
                const totalDeliveryFee = totalQuantity * deliveryFee;
                productShippingFee.push(totalDeliveryFee);
                const productDetail = [];
                productDetail.push(product.product);
                productDetail.push(product.totalProductQuantity);
                productDetails.push(productDetail)
            };
            

            const shippingFee: number = deliverFeeCalc(productShippingFee);
            const order = await Order.create({
                user: user_id,
                name: contact_person_name,
                phone: contact_person_phone,
                deliverymethod: "Door Delivery",
                shippingmethod: shipping_method,
                subtotal: cart.totalPrice,
                totalPrice: cart.totalPrice + shippingFee,
                deliveryfee: shippingFee,
                paymentmethod: payment_method
            }) 
            
            return res.status(200).json({
                status: `success`,
                order
            })
    }
    else if(doordelivery){
        if (!state) {
            return res.status(406).json({
                status: `failed`,
                message: `Delivery address must be specified`
            })
        }
        const firstLetter = state[0].toUpperCase();
        const otherLetters = state.slice(1).toLowerCase();
        const joinStataeString = firstLetter+otherLetters;
        const stateDelivery = await Delivery.findOne({state: joinStataeString});
        const deliveryFee: any = stateDelivery?.deliveryfee;

        
        const productDetails: Array<Array<String>> = [];

        for (const product of cart.products) {
            productDetails.push([product.product, product.totalProductQuantity]);
        };

        

        const order = await Order.create({
            product: productDetails,
            user: user_id,
            name: contact_person_name,
            phone: contact_person_phone,
            deliverymethod: "Pickup Station",
            shippingmethod: shipping_method,
            subtotal: cart.totalPrice,
            totalPrice: cart.totalPrice +deliveryFee,
            deliveryfee: deliveryFee,
            paymentmethod: payment_method
        });

        let returnedOrder: {
            totalPrice: number,
        };

        returnedOrder = {
            totalPrice: order.totalPrice
        };

        req.order = returnedOrder;
       
       
        return res.status(200).json({
            status: `success`,
            order
        })
    }
        
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}