
import express, {Request, Response, NextFunction} from 'express';
import { MONGO_URI, configType, PORT} from './accessories/configuration';
import connectDB from './db/dbConnect';
import morgan from 'morgan';
import routes from './route';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import SwaggerUI from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import YAML from 'yamljs';
const xss = require('xss-clean');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

const SwaggerDocumentation = YAML.load('./documentation.yaml')



const app = express();
app.use(morgan('common'));
app.use(cors());
app.use(xss())
app.use(express.json());
app.use(limiter);
app.use(express.urlencoded({extended: true}))
app.use('/ecommerce/v1', routes);


app.get('/', (req, res) => {
    res.send('<h1>E-Commerce API Developed By MallamTY<h1><a href="/api-documentation">Click here for the API documentation</a>')
})

app.use('/api-documentation', SwaggerUI.serve, SwaggerUI.setup(SwaggerDocumentation))

class App {
    private port: configType;

    constructor() {
        this.port =  PORT;
        this.startUp();
        this.home();
        this.errorHander();
    }

    private startUp = async() => {
        try {
            const port: configType = PORT || 9000;
            await connectDB(MONGO_URI)
            app.listen(port,() => console.log(`\n eCommerce-API running on port ${port}...`))
                    
         } catch (error: any) {
             console.log(`${error.message} was encountered while trying to connect to the database`);
             process.exit(1)
             
         } 
    }

    private home(): void {
        app.get('*', (req, res) => {
            return res.status(StatusCodes.OK).send(`<h1>Welcome to MallamTY E-Commerce Page</h1>`);
        })
    }

    private errorHander(): void {
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })  
        });
    }
}

export default new App();