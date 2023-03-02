import { RequestHandler } from "express";
import Cart from "../model/cart.model";
import Product from "../model/product.model";
import Variation from "../model/variation.model";




export const cartProduct: RequestHandler = async(req, res, next) => {
    try {
        let reqbody: {
            user_id: string,
            product_id: string,
            quantity: string,
            variation: string
        };
    
        const {user: {user_id},
                    body: {quantity,variation, product_id}    
        } = req;
        
        
        if(!quantity) {
            return res.status(406).json({
                status: `Failed !!!!!`,
                message: `Quantity must be specified !!!`
            }) 
        }
        const cart: any = await Cart.findOne({customer: user_id});
        const dbVariation = await Variation.findOne({variation});
        const variationObjId = dbVariation?.id;
        const product: any = await Product.findById(product_id);
        let price: number = product.price;
                
        if (cart) {

            const index = cart.products.findIndex((value: any) => 
            value.product.toString() === product_id.toString());
   
            if(!variation) {
                if (index !== -1 && quantity <= 0) {
                    cart.products.splice(index, 1)
                }
                else if (index !== -1) {
                    cart.products[index].totalProductQuantity += quantity;
                    cart.products[index].totalProductPrice += price * quantity;
                    cart.totalQuantity += quantity;
                    cart.totalPrice += price * quantity;

                    cart.save();
                    return res.status(201).json({
                        status: `success`,
                        message: `product added to your cart`,
                        cart
                    })
                }
                else if(index === -1 && quantity > 0) {
                    
                    cart.products.push({
                        product: product_id,
                        totalProductQuantity: quantity,
                        totalProductPrice: price * quantity
                    })
                    cart.totalQuantity += quantity;
                    cart.totalPrice += price * quantity;
    
                    cart.save();
                    return res.status(201).json({
                        status: `success`,
                        message: `product added to your cart`,
                        cart
                    })
                }
                else {
                    return res.status(400).json({
                        status: `Failed !!!`,
                        message: `Bad request !!!`
                    })
                } 
            }       

            if (index !== -1 && quantity <= 0) {
                cart.products.splice(index, 1)
            }
            else if (index !== -1 && cart.products[index].selectedVariation.toString() 
            === variationObjId.toString()
            ) {
                cart.products[index].totalProductQuantity += quantity;
                cart.products[index].totalProductPrice += price * quantity
                cart.totalQuantity += quantity;
                cart.totalPrice += price * quantity;

                cart.save();
                return res.status(201).json({
                    status: `success`,
                    message: `product added to your cart`,
                    cart
                })
            }
            else if(index === -1) {
    
                cart.products.push({
                    product: product_id,
                    totalProductQuantity: quantity,
                    totalProductPrice: price * quantity
                })
                cart.totalQuantity += quantity;
                cart.totalPrice += price * quantity;

                cart.save();
                return res.status(201).json({
                    status: `success`,
                    message: `product added to your cart`,
                    cart
                })
            }

            else {
                return res.status(400).json({
                    status: `Failed !!!`,
                    message: `Bad request !!!`
                })
            }
        };

        if(variation) {
            const newCart = await Cart.create({
                customer: user_id,
                products:[{
                    product: product_id,
                    selectedVariation: variationObjId,
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
                status: `success`,
                message: `product added to your cart`,
                cart: newCart
            })
        }
        else{
                const newCart = await Cart.create({
                    customer: user_id,
                    products:[{
                        product: product_id,
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
                    status: `success`,
                    message: `product added to your cart`,
                    cart: newCart
                })

        }
   
    
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
            variation: string
        }
    
        const {user: {user_id},
                    body: {variation, product_id}    
        } = req;
        
        const cart = await Cart.findOne({customer: user_id});
        const dbVariation = await Variation.findOne({variation});
        const variationObjId = dbVariation?.id;
        const product = await Product.findById(product_id);
        const price: any = product?.price;

        if(!cart) {
            return res.status(406).json({
                status: `failed`,
                message: `Cart is empty !!!`
            }) 
        }
        
        
        const productsIndexes: any = cart.products.reduce((outputArray: Array<number>, currentProduct, index: number) => {
            if (currentProduct.product.toString() === product_id.toString()) outputArray.push(index);
            
            return outputArray;
          }, []);
          
          if(variation) {
            if (productsIndexes.length === 0) {
                return res.status(406).json({
                    status: `failed`,
                    message: `${product?.name} has not been carted`
                }) 
              };
            for (const productIndex of productsIndexes) {
            
            const variationToString: any = cart.products[productIndex].selectedVariation;

            if (
                cart.products[productIndex].totalProductQuantity === 1 && 
                variationToString.toString() === variationObjId.toString()
                ) {
                cart.products.splice(productIndex, 1);
                cart.totalQuantity -= 1;
                cart.totalPrice -= price;
            }
            else if(
                variationToString.toString() === variationObjId.toString()
            ){
                cart.products[productIndex].totalProductQuantity -= 1; 
                cart.products[productIndex].totalProductPrice -= price;
                cart.totalQuantity -= 1
                cart.totalPrice -= price;
            }
            }
            const updatedCart = await cart.save();
            return res.status(200).json({
                status: `success`,
                message: `Cart has been reduced by one !!!`,
                cart: updatedCart
            }) 
            };
        

            if (productsIndexes.length === 0) {
                return res.status(406).json({
                    status: `failed`,
                    message: `${product?.name} has not been carted`
                }) 
              };
            for (const productIndex of productsIndexes) {

            if (
                cart.products[productIndex].totalProductQuantity === 1
              ) {
                cart.products.splice(productIndex, 1);
                cart.totalQuantity -= 1;
                cart.totalPrice -= price;
            }

            else{
                 
                cart.products[productIndex].totalProductQuantity -= 1; 
                cart.products[productIndex].totalProductPrice -= price;
                cart.totalQuantity -= 1
                cart.totalPrice -= price;
            }
          }
            const updatedCart = await cart.save();
            return res.status(200).json({
                status: `success`,
                message: `Cart has been reduced by one !!!`,
                cart: updatedCart
            }) 
          
    } catch (error: any) {
        res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}


export const increaseCartByOne: RequestHandler = async(req, res, next) => {
    try {
        let reqbody: {
            user_id: string,
            product_id: string,
            size: string,
            color: string
        }
    
        const {user: {user_id},
                    body: {variation, product_id}    
        } = req;
        
        const cart = await Cart.findOne({customer: user_id});
        const dbVariation = await Variation.findOne({variation});
        const variationObjId = dbVariation?.id;
        const product = await Product.findById(product_id);
        const price: any = product?.price;

        if(!cart) {
            return res.status(406).json({
                status: `failed`,
                message: `Cart is empty !!!`
            }) 
        }
        
        const productsIndexes: any = cart.products.reduce((outputArray: Array<number>, currentProduct, index: number) => {
            if (currentProduct.product.toString() === product_id.toString()) outputArray.push(index);
            
            return outputArray;
          }, []);
          
          if(variation) {
            if (productsIndexes.length === 0) {
                return res.status(406).json({
                    status: `failed`,
                    message: `${product?.name} has not been carted`
                }) 
              };
            for (const productIndex of productsIndexes) {
            
            const variationToString: any = cart.products[productIndex].selectedVariation;

            if (
                variationToString.toString() === variationObjId.toString()
                ) {
                cart.products[productIndex].totalProductQuantity += 1; 
                cart.products[productIndex].totalProductPrice += price;
                cart.totalQuantity += 1;
                cart.totalPrice += price;
            }
            }
            const updatedCart = await cart.save();
            return res.status(200).json({
                status: `success`,
                message: `Cart has been reduced by one !!!`,
                cart: updatedCart
            }) 
            };

            if (productsIndexes.length === 0) {
                return res.status(406).json({
                    status: `failed`,
                    message: `${product?.name} has not been carted`
                }) 
              };
            for (const productIndex of productsIndexes){
                 
                cart.products[productIndex].totalProductQuantity += 1; 
                cart.products[productIndex].totalProductPrice += price;
                cart.totalQuantity += 1
                cart.totalPrice += price;
          };

            const updatedCart = await cart.save();
            return res.status(200).json({
                status: `success`,
                message: `Cart has been reduced by one !!!`,
                cart: updatedCart
            }) 
          
         
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}


export const getCartedProduct: RequestHandler = async(req, res, next) => {
    try {
        
        let reqbody: {
            user_id: string
        };
        
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
        return res.status(500).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        })
    }
}
    



export const deleteProductFromCart: RequestHandler = async(req, res, next) => {
    try {
    let reqbody: {
        user_id: string,
        product_id: string
    }

    const {user: {user_id},
                body: {variation, product_id}    
    } = req;
    
    
    const cart: any = await Cart.findOne({customer: user_id});
    const dbVariation = await Variation.findOne({variation});
    const variationObjId = dbVariation?.id;
    const product: any = await Product.findById(user_id);


    const productIndexes: any = cart?.products.reduce((outputArray: Array<number>,
        currentProduct: any, index: number
        ) => {
            if (currentProduct.product.toString() === product_id.toString())
            
            outputArray.push(index);
            return outputArray; 
        }, []);
        

        if (!cart) {
            return res.status(200).json({
                status: `success`,
                message: `Cart empty !!!`,
            })
        }

        if (productIndexes.length === 0) {
            return res.status(404).json({
                status: `failed`,
                message: `Product not in cart`,
            })
        }

        if(variation) {
            
            for (const productIndex of productIndexes) {
                const varationToString: any = cart?.products[productIndex].selectedVariation;
    
                
                if (varationToString.toString() === variationObjId.toString()
                ) {
                    if (cart.products.length === 1) {
                        await Cart.findOneAndDelete({customer: user_id});
                        return res.status(200).json({
                            status: `Success .......`,
                            message: `Product deleted from cart .......`
                        })
                    }
                    cart.totalPrice -= cart?.products[productIndex].totalProductPrice;
                    cart.totalQuantity -= cart.products[productIndex].totalProductQuantity;
                    cart?.products.splice(productIndex, 1);
                    await cart.save();
    
                    return res.status(200).json({
                        status: `Success .......`,
                        message: `Product deleted from cart .......`,
                        cart
                    })
                }
            }
    
        }
        
        for (const productIndex of productIndexes) {
            if (cart.products.length === 1) {
                await Cart.findOneAndDelete({customer: user_id});
                return res.status(200).json({
                    status: `Success .......`,
                    message: `Product deleted from cart .......`
                })
            }
            cart.totalPrice -= cart?.products[productIndex].totalProductPrice;
            cart.totalQuantity -= cart.products[productIndex].totalProductQuantity;
            cart?.products.splice(productIndex, 1);

            await cart.save();

            return res.status(200).json({
                status: `Success .......`,
                message: `Product deleted from cart .......`,
                cart
            })
            
        }


        await cart.save();

        return res.status(200).json({
            status: `Success .......`,
            message: `Product deleted from cart .......`,
            cart
        })
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
        return res.status(500).json({
            status: `Failed !!!`,
            error: error.message
        }) 
    }
}