import Order from "../model/checkout.model";
import Cart from "../model/cart.model";
import { RequestHandler } from "express";
import Product from "../model/product.model";


export const checkout: RequestHandler = async(req, res, next) => {
    try {
        const {body: {contactdetails, phone, name, deliverymethod, shippingmethod},
                user: {user_id}
    } = req

        if(!contactdetails || !deliverymethod || !shippingmethod) {
            return res.status(406).json({
                status: 'success',
                message: `All field must be filled`
            })
        }
        
        const cart = await Cart.findOne({customer: user_id});
        const productShippingFee: any = [];

        cart?.products.forEach(async(product) => {
            
            const fetchedProduct = await Product.findById(product.product)
            productShippingFee.push(fetchedProduct?.deliveryfee)
            console.log(fetchedProduct?.deliveryfee);
            
            
            
        })
        console.log(productShippingFee);
        

        
        
        
        

        // const productIndexes: any = cart?.products.reduce((outputArray: Array<number>,
        //     currentProduct: any, index: number
        //     ) => {
        //         if (currentProduct.product)
        //         outputArray.push(index);
        //         return outputArray; 
        //     }, []);

        // for(const product of productIndexes){
        //     const productShippingFee = await cart
        // }
        // const order = await Order.create({contactdetails, deliverymethod,
        //     shippingmethod, subtotel: cart?.totalPrice, total: })
        

    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}