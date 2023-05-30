import jwt from 'jsonwebtoken'
import  {app_constant } from '../config/index'
import * as Models from "../models";
import * as DAO from "../DAO"

let { admin_seckret_key, user_seckret_key } = app_constant.seckretKeys;


// generate_token 

const generateToken = async ( token_data:any ) => {
    return new Promise((resolve, reject) => {
        try {
            let seckretKey = null
            if (token_data.scope=="admin"){ seckretKey = admin_seckret_key}
            if (token_data.scope=="user"){ seckretKey = user_seckret_key}
            
            const token = jwt.sign(token_data, seckretKey)
            return resolve(token)
        } catch (error) {
            throw reject(error)
        }
    })
}

const decodeToken = async (token :string , type: string) => {
     let fetch_error = {
       type: "UNAUTHORIZED",
       error_message: "you are not authorized to perform this action",
     };
    return new Promise(async (resolve, reject) => {
        try {
            let seckretKey= null;
            if( type== "admin"){seckretKey= admin_seckret_key}
            else if( type== "user"){seckretKey= user_seckret_key}
             
            jwt.verify(token, seckretKey, (err:any, decoded:any) => {
               if(decoded == undefined){
               
                return reject(fetch_error)
               } else{
                return resolve(decoded)
               }
            })
        } catch (error) {
             throw reject(fetch_error)
        }
    })
}


const verifyToken = async ( token:string , type:string) => {
    let fetch_error = {
      type: "UNAUTHORIZED",
      error_message: "you are not authorized to perform this action",
    };
    try {
        
        let decoded: any = await decodeToken(token, type)
        let fetch_data: any;

        if (decoded.scope == "admin"){
            let query: any = {
                admin_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            }
            let projection = { __v: 0 }
            let options = { lean: true }
            fetch_data = await DAO.getData(Models.Sessions, query, projection, options)
        }
        if (decoded.scope == "user") {
            let query: any = {
                user_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            }
            let projection = { __v: 0 }
            let options = { lean: true }
            fetch_data = await DAO.getData(Models.Sessions, query, projection, options)
        }

        if (fetch_data.length) {
            return fetch_data[0]

        }
        else {
            throw fetch_error
        }
    } catch (error) {
            throw fetch_error;
    }
}

export { generateToken, decodeToken, verifyToken };