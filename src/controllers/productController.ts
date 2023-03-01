import { RequestHandler } from "express";
import Variation from "../model/variation.model";
import { deleteImage, multiUpload, uploads} from "../utitlity/cloudinary";
import Product from "../model/product.model";

type returnTodo = object | null;
interface returnDb {
    id: string,
    product: [string]
}
export const uploadProduct: RequestHandler = async(req, res, next) => {
   try {
    
    let reqbody: {
        name: string;
        description: string;
        price: number;
        quantity:number;
        deliveryfee: number
    }

   const {body: {name, description, price, quantity, variations, deliveryfee},
            user: {user_id}
    } = req;

   reqbody = {name, description, price, quantity, deliveryfee}
   if(!name || !description || !price ||!quantity) {
    return res.status(406).json({
        status: `Failed !!!!!`,
        message: `All fields must be fieled`
    })
   }
   if(!req.files && !req.file){
    return res.status(406).json({
        status: `Failed !!!!!`,
        message: `You need to upload some images of the product`
    })
   }
   
   const dbProduct = await Product.findOne({$and: [{seller: user_id} , {name}, {description}]})
   if(dbProduct) {
    return res.status(404).json({
        status: `Failed !!!!!`,
        message: `Product with this details exist has already been created !!!!`
    })
   }

   let public_id = [];
   let url= [];
   let files: any = req.files;
   for(const file of files){
        const prodImage = await multiUpload(file, 'Product/Images')
        public_id.push(prodImage.public_id);
        url.push(prodImage.url);
        
   }
   
   const main_mage_url: string = url[0];
   const main_image_id: string= public_id[0];
   const images_id: string[]= public_id.splice(1,public_id.length - 1)
   const images_url: string[]= url.splice(1, url.length - 1)
   
   const product: any = await (await Product.create({...reqbody, main_image_id, main_mage_url, 
    images_id, images_url, seller: user_id})).populate('seller');

if (variations) {
    const variationFormed = variations.split(',').map((variation: string) => variation.trim());
    const productVariationsIds: Array<string> = [];
 
    await Promise.all(
     variationFormed.map(async(variation: string) => {
         const dbVariation: any = await Variation.findOne({variation});
         let product_id = product.id
         if (!dbVariation) {
             const newVariation = await Variation.create({product: product.id, variation})
             productVariationsIds.push(newVariation.id)
         }
         else{
             productVariationsIds.push(dbVariation.id)
             dbVariation.product.push(product_id)
             await dbVariation.save()
         }
     })
    );
    
    product.variation = productVariationsIds;

}
   await product.save()
   if (!product) {
    return  res.status(501).json({
        status: `failed`,
        message: `Unable to upload your product !!!!!!!!!`
    })
   }
   return res.status(200).json({
    status: `success`,
    message: `Product uploaded`,
    product
})

   } catch (error: any) {
    return res.status(500).json({
        status: `failed`,
        message: error.message
    })
   }
}

export const updateProduct: RequestHandler = async(req, res, next) => {
    try {
        const {params: {id}} = req;

        if(!id) {
            return res.status(404).json({
                status: `failed`,
                message: `Product ID not specified`,
            })
        }
        
        const dbProduct: any = await Product.findById(id);
            deleteImage(dbProduct.main_image_id);
            for (const public_id of dbProduct.images_id) {
                deleteImage(public_id);
            }
        let public_id = [];
        let url= [];
        let files: any = req.files;
        for(const file of files){
                const prodImage = await multiUpload(file, 'Product/Images')
                public_id.push(prodImage.public_id);
                url.push(prodImage.url);
                
        }
    
        const main_mage_url: string = url[0];
        const main_image_id: string= public_id[0];
        const images_id: string[]= public_id.splice(1,public_id.length - 1)
        const images_url: string[]= url.splice(1, url.length - 1);

        const updatedProduct = await Product.findByIdAndUpdate({_id: id}, 
                                                {...req.body, main_mage_url, main_image_id,
                                                    images_id, images_url
                                                }, {new: true}).populate('seller');

        if (!updatedProduct) {
            return res.status(406).json({
                status: `success`,
                message: `Product deleted`,
            })
        }

        return res.status(201).json({
            status: `success`,
            message: `Product updated`,
            updatedProduct

        })
        } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }
}


export const deleteProduct: RequestHandler = async(req, res, next) => {
    try {   
        const {params: {id}} = req;

        if(!id) {
            return res.status(404).json({
                status: `failed`,
                message: `Product ID not specified`,
            })
        }

        const deletedProduct: any = await Product.findByIdAndDelete(id);
        
        if(!deletedProduct) {
            return res.status(406).json({
                status: `failed`,
                message: `Error encountered while trying to delete product`,
            })
        }

        deleteImage(deletedProduct.main_image_id);
        for (const public_id of deletedProduct.images_id) {
            deleteImage(public_id);
        }
        return res.status(406).json({
            status: `success`,
            message: `Product deleted`,
        })
    } catch (error: any) {
        return res.status(500).json({
            status: `failed`,
            message: error.message
        })
    }

}