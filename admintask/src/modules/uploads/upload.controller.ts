import AWS from "aws-sdk";
import moment from "moment"
import { config } from "dotenv";
import { handleCatch, handleSuccess } from "../../middlewares";
config()
let do_spaces_key = process.env.DO_ACCESS_KEY;
let do_spaces_secret = process.env.DO_SECRET_ACCESS_KEY;
let do_spaces_bucket_name = process.env.BUCKET_NAME;
let do_region = process.env.DO_REGION;
let do_spaces_endpoint:any = process.env.DO_ENDPOINT;
let base_url = process.env.URL;

const spaceEndpoint = new AWS.Endpoint(do_spaces_endpoint);
const s3 = new AWS.S3({
    accessKeyId: do_spaces_key,
    secretAccessKey: do_spaces_secret,
    endpoint: spaceEndpoint
})




const uploadfile = async ( files: any ) => {
    try {
        let { name, data, mimetype } = files.file
        console.log("files-->",files)
        console.log("name--.",name)
        let file_name = await generate_file_name(name);
        let params = {
          Bucket: do_spaces_bucket_name,
          Key: `shared2/image/${file_name}`,
          ACL: "public-read",
          Body: data,
          ContentType: mimetype,
        };

        let uploaded_data:any = await upload_file_to_spaces(params);
        console.log("uploaded_data",uploaded_data)
        let response = {
          base_url: base_url,
          type: "IMAGE",
          folder: ["IMAGE"],
          file_name:file_name ,
        };
        return response;

    } catch (error) {
        throw error
    }
}

const generate_file_name = async ( file_name: string )=> {
 try {
       let current_millis = moment().format("x");
       let raw_file_name = file_name.split(/\s/).join(""); 
       let split_file = raw_file_name.split('.')
       let split_all = split_file[0].split(/[^a-zA-Z0-9]/g).join("_");

       let name = split_all.toLowerCase();
       let ext = split_file[1];

       let gen_file_name = `${name}_${current_millis}.${ext}`;

       return gen_file_name.toLowerCase();

   } catch (error) {
    throw error
}
}
const upload_file_to_spaces = ( params: any) => {
   return new Promise((resolve, reject) => {
     try {
       s3.upload(params, (err:any, data: any) => {
         if (err) {
           console.log("uploading error", err);
         } else {
           console.log("uploading successfull", data);
           return resolve(data);
         }
       });
     } catch (error) {
       return reject(error);
     }
   });
}



const uploadfiles = async ( req:any, res:Express.Response) => {
  try {
     let response = await uploadfile(req.files);
     handleSuccess(res, response);
  } catch (error) {
    handleCatch(res, error)
  }
  
}



export {
    uploadfiles,
    uploadfile
}