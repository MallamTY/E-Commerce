import { RequestHandler } from "express";
import isEmail from "validator/lib/isEmail";
import Cart from "../model/cart.model";
import Color from "../model/color.model";
import Product from "../model/product.model";
import Size from "../model/size.model";


export const cartProduct: RequestHandler = async(req, res, next) => {
    try {
        let reqbody: {
            user_id: string,
            product_id: string,
            quantity: string,
            size: string,
            color: string
        }
    
        const {user: {user_id},
                    body: {quantity, size, color, product_id}    
        } = req;
        
        
        if(!quantity) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Quantity must be specified !!!`
            }) 
        }
        
        if(!size) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Size must be specified !!!`
            }) 
        }
        
        if(!color) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Color must be specified !!!`
            }) 
        }
        const cart: any = await Cart.findOne({customer: user_id});
        const dbColor = await Color.findOne({color});
        const dbSize = await Size.findOne({size});
        const colorObjId = dbColor?.id; 
        const sizeObjId = dbSize?.id;
        const product: any = await Product.findById(product_id);
         
        let price: number = product.price;
        if (cart) {
            
            
            const index = cart.products.findIndex((value: any) => 
            value.product.toString() === product_id.toString());
            
            console.log(index);
            
            
            if (index !== -1 && quantity <= 0) {
                cart.products.splice(index, 1)
            }
            else if (index !== -1 && cart.products[index].selectedColor.toString()
                === colorObjId.toString() && cart.products[index].selectedSize.toString() === sizeObjId.toString()
            ) {
                
                cart.products[index].totalProductQuantity += quantity;
                cart.products[index].totalProductPrice += price * quantity
                cart.totalQuantity += quantity;
                cart.totalPrice += price * quantity;
            }
            else if(index !== -1 && quantity > 0) {
                
                cart.products.push({
                    product: product_id,
                    selectedColor: dbColor?.id,
                    selectedSize: dbSize?.id,
                    totalProductQuantity: quantity,
                    totalProductPrice: price * quantity
                })
                cart.totalQuantity += quantity;
                cart.totalPrice += price * quantity;
            }
            else {
                return res.status(400).json({
                    status: `Failed !!!`,
                    message: `Bad request !!!`
                })
            }

            cart.save();

            return res.status(201).json({
                status: `Success ...............`,
                message: `product added to your cart`,
                cart
            })

        };

    const newCart = await Cart.create({
        customer: user_id,
        products:[{
            product: product_id,
            selectedColor: dbColor?.id,
            selectedSize: dbSize?.id,
            totalProductQuantity: quantity,
            totalProductPrice: price * quantity
        }],
        totalQuantity: quantity,
        totalPrice: price * quantity,
    })
    
    if (!newCart) {
        return res.status(400).json({
            status: `Failed !!!`,
            message: `Error adding cart !!!`
        })
    }
    return res.status(201).json({
        status: `Success ...............`,
        message: `product added to your cart`,
        cart: newCart
    })
    
    } catch (error:any) {
        res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        })
    }
}

export const decreaseCartByOne: RequestHandler = async(req, res, next) => {
    try {
        let reqbody: {
            user_id: string,
            product_id: string,
            size: string,
            color: string
        }
    
        const {user: {user_id},
                    body: {size, color, product_id}    
        } = req;
        
        
        if(!size) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Size must be specified !!!`
            }) 
        }
        
        if(!color) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Color must be specified !!!`
            }) 
        }
        
        const cart = await Cart.findOne({customer: user_id});
        const dbColor = await Color.findOne({color});
        const dbSize = await Size.findOne({size});
        const colorObjId = dbColor?.id; 
        const sizeObjId = dbSize?.id;

        const product = await Product.findById(product_id);
        const price: any = product?.price;

        if(!cart) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Cart is empty !!!`
            }) 
        }
        
        
        const productsIndexes: any = cart.products.reduce((outputArray: Array<number>, currentProduct, index: number) => {
            if (currentProduct.product.toString() === product_id.toString()) outputArray.push(index);
            
            return outputArray;
          }, []);


          if (productsIndexes === -1) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `${product?.name} has not been carted`
            }) 
          };

          for (const productIndex of productsIndexes) {
            const colorToString: any = cart.products[productIndex].selectedColor;
            const sizeToString: any = cart.products[productIndex].selectedSize;
            if (
                cart.products[productIndex].totalProductQuantity === 1 && 
                colorToString.toString() === colorObjId.toString() &&
                sizeToString.toString() === sizeObjId.toString()
              ) {
                cart.products.splice(productIndex, 1);
                cart.totalQuantity -= 1;
                cart.totalPrice -= price;
            }
            else if(
                colorToString.toString() === colorObjId.toString() &&
                sizeToString.toString() === sizeObjId.toString()
            ){
                const updatedProductTotalQuantity =
                cart.products[productIndex].totalProductQuantity - 1;
                const updatedProductTotalPrice =
                cart.products[productIndex].totalProductPrice - price;
                const updatedCartTotalQuantity = cart.totalQuantity - 1;
                const updatedCartTotalPrice = cart.totalPrice - price;

                cart.products[productIndex].totalProductQuantity =
                updatedProductTotalQuantity;
                cart.products[productIndex].totalProductPrice = updatedProductTotalPrice;
                cart.totalQuantity = updatedCartTotalQuantity;
                cart.totalPrice = updatedCartTotalPrice;

            }
            }


            const updatedCart = await cart.save();

            return res.status(200).json({
                status: `success !!!!!`,
                message: `Cart has been reduced by one !!!`,
                cart: updatedCart
            }) 

    } catch (error: any) {
        res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        })
    }
}


export const IncreaseCartByOne: RequestHandler = async(req, res, next) => {
    try {
        let reqbody: {
            user_id: string,
            product_id: string,
            size: string,
            color: string
        }
    
        const {user: {user_id},
                    body: {size, color, product_id}    
        } = req;
        
        
        if(!size) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Size must be specified !!!`
            }) 
        }
        
        if(!color) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Color must be specified !!!`
            }) 
        }
        
        const cart = await Cart.findOne({customer: user_id});
        const dbColor = await Color.findOne({color});
        const dbSize = await Size.findOne({size});
        const colorObjId = dbColor?.id; 
        const sizeObjId = dbSize?.id;

        const product = await Product.findById(product_id);
        const price: any = product?.price;

        if(!cart) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Cart is empty !!!`
            }) 
        }
        
        
        const productsIndexes: any = cart.products.reduce((outputArray: Array<number>, currentProduct, index: number) => {
            if (currentProduct.product.toString() === product_id.toString()) outputArray.push(index);
        
            return outputArray;
          }, []);
          


          if (productsIndexes === -1) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `${product?.name} has not been carted`
            }) 
          };

          for (const productIndex of productsIndexes) {
            const colorToString: any = cart.products[productIndex].selectedColor;
            const sizeToString: any = cart.products[productIndex].selectedSize;
            if(
               
                colorToString.toString() === colorObjId.toString() &&
                sizeToString.toString() === sizeObjId.toString()
            ){
                const updatedProductTotalQuantity =
                cart.products[productIndex].totalProductQuantity + 1;
                const updatedProductTotalPrice =
                cart.products[productIndex].totalProductPrice + price;
                const updatedCartTotalQuantity = cart.totalQuantity + 1;
                const updatedCartTotalPrice = cart.totalPrice + price;

                cart.products[productIndex].totalProductQuantity =
                updatedProductTotalQuantity;
                cart.products[productIndex].totalProductPrice = updatedProductTotalPrice;
                cart.totalQuantity = updatedCartTotalQuantity;
                cart.totalPrice = updatedCartTotalPrice;

            }
        }
        const updatedCart = await cart.save();

        return res.status(200).json({
            status: `success !!!!!`,
            message: `Cart has been reduced by one !!!`,
            cart: updatedCart
        }) 

    } catch (error: any) {
        res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        })
    }
}


export const getCartedProduct: RequestHandler = async(req, res, next) => {
try {
    
        let reqbody: {
        user_id: string
    }
    
   let {user: {user_id}} = req;

   const cart = await Cart.findOne({customer: user_id});

   if (!cart) {
    return res.status(406).json({
        status: `Failed !!!!!`,
        message: `Cart is empty !!!`
    }) 
   }

   return res.status(200).json({
    status: `Success ........`,
    message: `Cart successfully loaded .....`,
    cart
   })
} catch (error: any) {
    res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
}
}


export const deleteProductFromCart: RequestHandler = async(req, res, next) => {
try {
    let reqbody: {
        user_id: string,
        product_id: string,
        size: string,
        color: string
    }

    const {user: {user_id},
                body: {size, color, product_id}    
    } = req;
    
    if(!size) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Size must be specified !!!`
        }) 
    }
    
    if(!color) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Color must be specified !!!`
        }) 
    }
    
    
    const cart: any = await Cart.findOne({customer: user_id});
    if (!cart) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Cart is empty!!!`
        }) 
    }
    
    const dbColor= await Color.findOne({color});
    const dbSize = await Size.findOne({size});
    const colorObjId = dbColor?.id;
    const sizeObjId = dbSize?.id;

    const product: any = await Product.findById(user_id);

    const productIndexes: any = cart?.products.reduce((outputArray: Array<number>,
        currentProduct: any, index: number
        ) => {
            if (currentProduct.product.toString() === product_id.toString())
            outputArray.push(index);
            return outputArray; 
        }, [])


        for (const productIndex of productIndexes) {
            const colorToString: any = cart?.products[productIndex].selectedColor;
            const sizeToString: any = cart?.products[productIndex].selectedSize;
            
            if (colorToString.toString() === colorObjId.toString() &&
                sizeToString.toString() === sizeObjId.toString()
            ) {
                
                const totalPrice: number = cart?.totalPrice - cart?.products[productIndex].totalProductPrice;
                const totalQuantity = cart.totalQuantity - cart.products[productIndex].totalProductQuantity;
                cart?.products.splice(productIndex, 1);
                
                cart.totalPrice = totalPrice;
                cart.totalQuantity = totalQuantity;
                await cart.save();

                return res.status(200).json({
                    status: `Success .......`,
                    message: `Product deleted from cart .......`,
                    cart
                })
            }
        }
} catch (error: any) {
    res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
}
};


export const deleteCart: RequestHandler = async(req, res, next) => {
 try {
    let reqbody: {
        user_id: string
    };

    const {user: {user_id}} = req;

    const cart = await Cart.findOne({customer: user_id});
    console.log(cart);
    

    if (!cart) {
        return res.status(406).json({
            status: `Failed !!!!!`,
            message: `Cart is empty !!!`
        });  
    }

    await Cart.findOneAndDelete({customer:user_id});

    return res.status(200).json({
        status: `Success !!!!!`,
        message: `Cart successfully deleted !!!`
    });  
}
 catch (error: any) {
    res.status(500).json({
        status: `Failed !!!`,
        error: error.message
    })
 }
}