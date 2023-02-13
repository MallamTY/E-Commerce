import { RequestHandler } from "express";
import Color from "../model/color.model";
import Product from "../model/product.model";
import Size from "../model/size.model";
import { multiUpload} from "../utitlity/cloudinary";

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
    }

    let color_size: {
        colors: string;
        sizes: string
    }
   const {body: {name, description, price, quantity,colors, sizes},
            user: {user_id}
    } = req;

    color_size = {colors, sizes}
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
   
   const product: any = await (await Product.create({...reqbody, main_image_id, main_mage_url, 
    images_id, images_url, seller: user_id})).populate('seller')
   const colorFormed = colors.split(',').map((color: string) => color.trim())
   const sizeFormed = sizes.split(',').map((size:string) => size.trim())
   const productColorsIds: Array<string> = [];
   const productSizesIds: Array<string>= [];

   await Promise.all(
    colorFormed.map(async(color: string) => {
        const dbColor: any = await Color.findOne({color});
        let product_id = product.id
        if (!dbColor) {
            const newColor = await Color.create({product: product.id, color})
            productColorsIds.push(newColor.id)
        }
        else{
            productColorsIds.push(dbColor.id)
            dbColor.product.push(product_id)
            await dbColor.save()
        }
    })
   );

   await Promise.all(
    sizeFormed.map(async(size: string) => {
        const dbSize: any = await Size.findOne({size})
        
        if (!dbSize) {
            const newSize = await Size.create({product: product.id, size})
            productSizesIds.push(newSize.id)
        }
        else{
            dbSize.product.push(product.id)
            productSizesIds.push(dbSize.id)
            await dbSize.save()
        }
    })
   )
   
   product.colors = productColorsIds;
   product.sizes = productSizesIds;

   await product.save()

   if (!product) {
    return  res.status(501).json({
        status: `Failed !!!!!!!!!!!!`,
        message: `Unable to upload your product !!!!!!!!!`
    })
   }
   return res.status(200).json({
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
