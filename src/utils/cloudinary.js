import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});  // from docs

const uploadOnCloudinary = async(localFilePath) => {
    try{
        console.log("file path is", localFilePath)
        if(!localFilePath){
            console.log("inside not found filepath")
            return null
        }
            // upload the file on cloudinary
        console.log("not in error block")
        const response= await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        })
        // file has been uploaded successfully
        console.log("printing response-----", response);
        console.log("file is uploaded on cloudinary", response.url)// check what's in this response
        return response;
    } catch(error){
        console.log("in try catch block 2",error.message)
        // localfile path to aa chuka mtlb upload hone m dikkat hai bs
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null ;
    }

}

export default uploadOnCloudinary ;

