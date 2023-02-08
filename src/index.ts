
import express, {Request, Response, NextFunction} from 'express';
import { MONGO_URI, configType, PORT} from './accessories/configuration';
import connectDB from './db/dbConnect';
import morgan from 'morgan';
import UserRoute from './route/user.route';
import ProductRoute from './route/product.route';
import CartRoute from './route/cart.route';
import FavouriteRoute from './route/favourite.route';

const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/ecommerce/v1', UserRoute);
app.use('/ecommerce/v1', ProductRoute);
app.use('/ecommerce/v1', CartRoute);
app.use('/ecommerce/v1', FavouriteRoute);




app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        message: err.message
    })  
});


const startUp = async() => {
    try {
        const port: configType = PORT || 9000;
        await connectDB(MONGO_URI)
        app.listen(port,() => console.log(`\neCommerce-API running on port ${port}...`))
                
     } catch (error: any) {
         console.log(`${error.message} was encountered while trying to connect to the database`);
         process.exit(1)
         
     }
     
}

startUp()