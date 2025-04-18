import {v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET
});


    // Upload an image
//     const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });
 
//  console.log(uploadResult);


const upload_on_cloudinary = async (localfilepath)=>{
   try {
    if(!localfilepath) return null
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload
    (localfilepath,{
        resource_type:"auto"
    })
    // file has been uploaded successfully
    //console.log("file is uploaded on cloudinary",
      //  response.url);
      fs.unlinkSync(localfilepath) // jb file upload ho chuki hai tb ye karenge taki file delete ho jaye
        return response;
    
   } catch (error) {
    fs.unlinkSync(localfilepath) // remove the locally saved temporary files as the upload operation got failed
    return null;
   } 
}

export {upload_on_cloudinary}
