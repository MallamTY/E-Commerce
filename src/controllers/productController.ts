import { RequestHandler } from "express";
import Product from "../model/product.model";
import { multiUpload} from "../utitlity/cloudinary";

type returnTodo = object | null;
export const uploadProduct: RequestHandler = async(req, res, next) => {
   try {
    
    let reqbody: {
        name: string;
        description: string,
        price: number
        quantity:number;
    }

    
   const {body: {name, description, price, quantity},
            user: {user_id}
    } = req;
   reqbody = {name, description, price, quantity}
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
   
   const product: returnTodo = await (await Product.create({...reqbody, main_image_id, main_mage_url, images_id, images_url, seller: user_id})).populate('seller')
   console.log(product);
   
   if (!product) {
    return  res.status(501).json({
        status: `Failed !!!!!!!!!!!!`,
        message: `Unable to upload your product !!!!!!!!!`
    })
   }
   return res.status(501).json({
    status: `Success ...............`,
    message: `Product uploaded`,
    product
})

   } catch (error: any) {
    res.status(500).json({
        status: `Failed !!!!!!!!!!!!`,
        message: error.message
    })
   }
   

}      
