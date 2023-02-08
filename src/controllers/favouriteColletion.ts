import { RequestHandler } from "express";
import Favourite from "../model/favourites.model";
import Product from "../model/product.model";



export const addOrRemoveProductToFavourite: RequestHandler = async(req, res, next) => {
   try {
    let requestVal: {
        product_id: string,
        user_id: string;
    }

    const {user: {user_id}, 
            body: {product_id}
    } = req;
    
    const product = await Product.findById(product_id)
    const favourites: object | any = await Favourite.findOne({customer: user_id})
    
    if(!favourites) {
        const newFavourites = await Favourite.create({customer: user_id, products: product_id})

        return res.status(201).json({
            status: `Success !!!!!`,
            message: `${product?.name} has been added to your favourite products`,
            favourite: newFavourites
        }); 
    }
    else if (favourites.products.includes(product_id) && favourites.products.length === 1) {
        await Favourite.findOneAndRemove({customer: user_id})
        return res.status(200).json({
            status: `Success !!!!!`,
            message: `${product?.name} has been removed from your favourite products`,
            favourites: {}
        }); 
    }
    
    else if(!favourites.products.includes(product_id) && favourites.products.length !== 0) {
        
        favourites.products.push(product_id);
        favourites.save()
        return res.status(200).json({
            status: `Success !!!!!`,
            message: `${product?.name} has been added to your favourite products`,
            favourites
        }); 
    }
    else if (favourites.products.includes(product_id) && favourites.products.length > 1) {
    
        for (const productId of favourites.products) {
                if (productId.toString() === product_id) {
                    const productIndex = favourites.products.indexOf(productId);
                    favourites.products.splice(productIndex, 1);

                    await favourites.save()
                    return res.status(200).json({
                        status: `Success !!!!!`,
                        message: `${product?.name} has been added to your favourite products`,
                        favourites
                    });  
                }
                
            }
            
        }

        else{
            return res.status(404).json({
                status: `Failed !!!!!`,
                message: `An error was encountered`
            })
        }
        //favourites.splice(productIndex,1);
   } catch (error: any) {
    res.status(500).json({
        status: `Failed !!!`,
        error: error.message
    })
   }

}

