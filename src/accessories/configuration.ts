let dotenvConfig: DotenvConfigOutput;
import {config, DotenvConfigOutput} from 'dotenv'
dotenvConfig = config()


export type configType = string | undefined | number;


export const MONGO_URI: configType = process.env.MONGO_URI;
export const PORT: configType = process.env.PORT;
export const JWT_SECRET: string = process.env.JWT_SECRET || '';
