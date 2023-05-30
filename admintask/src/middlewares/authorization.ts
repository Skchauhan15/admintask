import { verifyToken, handleCatch } from "./index";
import * as DAO from "../DAO";
import * as Models from "../models";
import { app_constant } from "../config/index";
const { scope } = app_constant;
const admin_scope = scope.admin;
const user_scope = scope.user;

const authorization = async (req: any, res: any, next: any) => {
  try {
    let { token } = req.headers,
      api_path = req.originalUrl;

    let admin_path = api_path.includes("admin");
    let user_path = api_path.includes("user");
   // if (admin_path) {
      let fetch_token_data: any = await verifyToken(token, admin_scope);
      if (fetch_token_data) {
        let { admin_id, access_token, token_gen_at } = fetch_token_data;

        let query: any = { _id: admin_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.getData(
          Models.Admin,
          query,
          projection,
          options
        );
        
        if (fetch_data.length > 0) {
          fetch_data[0].access_token = access_token;
          fetch_data[0].token_gen_at = token_gen_at;
          req.admin_data = fetch_data[0];
          req.session_data = fetch_token_data;
          next();
        } else {
          throw {
            type: "UNAUTHORIZED",
            error_message: "you are not authorized to perform this action",
          };
        }
      } else {
        throw {
          type: "UNAUTHORIZED",
          error_message: "you are not authorized to perform this action",
        };
      }
   // }
    // else if (user_path ) {
    //   let fetch_token_data: any = await verifyToken(token, user_scope);
    //   if (fetch_token_data) {
    //     let { user_id, access_token, device_type, fcm_token, token_gen_at } =
    //       fetch_token_data;

    //     let query: any = { _id: user_id };
    //     let projection = { __v: 0, password: 0 };
    //     let options = { lean: true };
    //     let fetch_data: any = await DAO.getData(
    //       Models.Users,
    //       query,
    //       projection,
    //       options
    //     );

    //     if (fetch_data.length > 0) {
    //       fetch_data[0].access_token = access_token;
    //     //   fetch_data[0].device_type = device_type;
    //     //   fetch_data[0].fcm_token = fcm_token;
    //       fetch_data[0].token_gen_at = token_gen_at;
    //       req.user_data = fetch_data[0];
    //       req.session_data = fetch_token_data;
    //       next();
    //     } else {
    //       throw await handleCustomError("UNAUTHORIZED");
    //     }
    //   } else {
    //     throw await handleCustomError("UNAUTHORIZED");
    //   }
    // }
    // else {
    //   throw {
    //     type: "UNAUTHORIZED",
    //     error_message: "you are not authorized to perform this action",
    //   };
    // }
  } catch (err) {
    handleCatch(res, err);
  }
};

export default authorization;
