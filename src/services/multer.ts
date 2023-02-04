'use strict';
import multer from "multer";
import path from 'path'
import { DataURI } from "datauri/types";
import { RequestHandler } from "express";


const storage = multer.memoryStorage();


//const dUri = new DataUri();
/**
* @description This function converts the buffer to data url
* @param {Object} req containing the field object
* @returns {String} The data url from the string buffer
*/
//exports.dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);



const filefilter: any = (req: Request, file: any, cb: CallableFunction) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' 
        || file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg'|| file.mimetype === 'video/mp4' ){
        cb(null, true)
    }

    else{
        cb(null, false)
    }
}
export const multerUploads = multer({ storage, fileFilter: filefilter }).single('image');
export const multiMulterUploads = multer({storage}).any()


