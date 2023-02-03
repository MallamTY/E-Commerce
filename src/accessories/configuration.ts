let dotenvConfig: DotenvConfigOutput;
import { ConfigOptions } from 'cloudinary';
import {config, DotenvConfigOutput} from 'dotenv'
dotenvConfig = config()


export type configType = string | undefined | number | keyof ConfigOptions;


export const MONGO_URI: configType = process.env.MONGO_URI;
export const PORT: configType = process.env.PORT;
export const JWT_SECRET: string = process.env.JWT_SECRET || '';

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY
export const API_SECRET= process.env.API_SECRET  
export const SECURE: any = process.env.SECURE;
