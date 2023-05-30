import { verifyToken, handleCatch } from "./index";
import * as DAO from "../DAO"
import * as Models from "../models"
import { seckretKeys } from "../config/app_constant";
import jwt from "jsonwebtoken";


const email_auth = async ( req:any , res:any , next:any) => {
    try {
        let { token } = req.headers;
        if(!token){
            throw {type: "UNAUTHORIZED", error_message: "token is not provided"}
        }
        const decoded: any = jwt.verify(token, seckretKeys.admin_seckret_key);
        if (!decoded._id) {
              throw {type: "UNAUTHORIZED", error_message: "Invalid token"}
        }
        console.log(`decoded`,decoded)
        let query = { _id: decoded._id }
        let projection ={ _v:0 };
        let options ={ lean: true }
        let fetch_data:any = await DAO.getData(Models.Admin, query, projection, options)
        if(fetch_data.length){
          req.admin_data = fetch_data[0];
          next();  
        }
    } catch (error) {
         handleCatch(res, error)
    }
}
export default email_auth