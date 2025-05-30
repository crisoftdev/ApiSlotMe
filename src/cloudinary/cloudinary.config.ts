// src/cloudinary/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: "dkxzyntbk",
    api_key: "426476697951845",
    api_secret: "A0tzCBvroQdFcWZs5LNReTbA5ro",

});

export default cloudinary;
