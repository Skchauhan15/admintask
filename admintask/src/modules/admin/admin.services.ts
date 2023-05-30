import * as Models from "../../models";
import * as DAO from "../../DAO";
import { app_constant } from "../../config/index";
const admin_scope = app_constant.scope.admin;
import {
  generateToken,
  helpers,
  sendEmail,
  sendNotification,
} from "../../middlewares/index";
import moment from "moment";
import * as email_services from "../../middlewares/email_services";
import { uploadfile } from "../uploads/upload.controller";
import { bcryptPassword } from "../../middlewares/helpers";
import helperss from "./admin.helper";
import { query, response } from "express";
import { profile } from "console";
import { ALL } from "dns";

export default class services {
  static verifyAdminInfo = async (query: any) => {
    try {
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options
      );
      return fetch_data;
    } catch (error) {
      throw error;
    }
  };
  static createAdmin = async (data: any) => {
    try {
      let { name, email, password } = data;
      let hassed_password = await helpers.bcryptPassword(password);

      let email_otp = await helpers.GenerateOtp();

      let data_to_save: any = {
        name: name,
        email: email,
        password: hassed_password,
        email_otp: email_otp,
      };

      let response: any = await DAO.saveData(Models.Admin, data_to_save);
      return response;
    } catch (error) {
      throw error;
    }
  };
  static token_Generate_and_SaveSession = async (
    _id: string,
    req_data: any
  ) => {
    try {
      let token_data = {
        _id: _id,
        scope: admin_scope,
        token_gen_at: +new Date(),
      };
      let access_token: any = await generateToken(token_data);
      let response = await this.save_session_data(
        access_token,
        token_data,
        req_data
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  static save_session_data = async (
    access_token: string,
    token_data: any,
    req_data: any
  ) => {
    try {
      let { _id: admin_id, token_gen_at } = token_data,
        { fcm_token } = req_data;

      let set_data: any = {
        admin_id: admin_id,
        access_token: access_token,
        token_gen_at: token_gen_at,
        created_at: +new Date(),
      };
      if (fcm_token != null || fcm_token != undefined) {
        set_data.fcm_token = fcm_token;
      }
      let response = await DAO.saveData(Models.Sessions, set_data);
      return response;
    } catch (error) {
      return error;
    }
  };

  static make_admin_response = async (session_data: any) => {
    try {
      let { admin_id, access_token, fcm_token, token_gen_at } = session_data;
      let query = { _id: admin_id };
      let projection = { __v: 0, password: 0, email_otp: 0, token_gen_at: 0 };
      let options = { lean: true };
      let response: any = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options
      );
      console.log("response", response);
      if (response.length) {
        response[0].access_token = access_token;
        // response[0].device_type = device_type;
        response[0].fcm_token = fcm_token;
        response[0].token_gen_at = token_gen_at;
        return response[0];
      } else {
        throw { error_message: "INVALID_OBJECT_ID" };
      }
    } catch (error) {
      throw error;
    }
  };
  static verify_email_otp = async (_id: string) => {
    try {
      let query = { _id: _id };
      let update = { is_email_verified: true };
      let options = { new: true };
      await DAO.findAndUpdate(Models.Admin, query, update, options);
      let response: any = { message: "password reset successfully " };
    } catch (error) {
      throw error;
    }
  };

  static resend_email_otp = async (email: string) => {
    try {
      let email_otp = await helpers.GenerateOtp();
      let query = { email: email };
      let update = { email_otp: email_otp };
      let options = { new: true };
      let response: any = await DAO.findAndUpdate(
        Models.Admin,
        query,
        update,
        options
      );
      return response;
    } catch (error) {
      throw {
        type: "ERROR",
        error_message: "this email is not exit",
      };
    }
  };

  static emailToken = async (_id: string, email_otp: any) => {
    try {
      let tokenData: any = { _id, scope: "admin" };
      let token: any = await generateToken(tokenData);
      return token;
    } catch (err) {
      throw { type: "token create error" };
    }
  };

  static reset_password_otp = async (email: string) => {
    try {
      let email_otp = await helpers.GenerateOtp();
      const otp_expire_in = moment().add(10, "minutes");
      let query = { email: email };
      let update = { email_otp: email_otp, otp_expire_in };
      let options = { new: true };
      let response: any = await DAO.findAndUpdate(
        Models.Admin,
        query,
        update,
        options
      );
      return response;
    } catch (error) {
      throw {
        type: "ERROR",
        error_message: "this email is not valid ",
      };
    }
  };

  static verify_pass_otp = async (_id: string, input_otp: string) => {
    try {
      let query = { _id: _id, email_otp: input_otp };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options
      );
      if (fetch_data.length) {
        return fetch_data[0];
      } else {
        throw { type: "ERROR", error_message: "somthing went wrong" };
      }
    } catch (error) {
      throw error;
    }
  };

  static resetPassword = async (_id: string, password: string) => {
    try {
      let query = { _id: _id };
      let hash = await helpers.bcryptPassword(password);
      console.log("hash", hash);
      let update = { password_reset: false, password: hash };
      let options = { new: true };
      let fetch_data = await DAO.findAndUpdate(
        Models.Admin,
        query,
        update,
        options
      );
      let response: any = {
        type: "SUCCESS",
        message: " your password is reset successfully",
      };
      return response;
    } catch (error) {
      throw error;
    }
  };

  static logIn = async (
    email: string,
    input_password: string,
    req_body: any
  ) => {
    try {
      let query = { email: email, is_deleted: false };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options
      );
      console.log(fetch_data);
      if (fetch_data.length > 0) {
        let { _id, password: hash } = fetch_data[0];
        let decrypted_password = await helpers.decryptPassword(
          input_password,
          hash
        );
        console.log(decrypted_password);
        if (decrypted_password != true) {
          throw { type: "Invalid login", error_message: "password not valid" };
        } else {
          let saved_session: any = await this.token_Generate_and_SaveSession(
            _id,
            req_body
          );
          let response: any = await this.make_admin_response(saved_session);

          await email_services.sendWelcomeMail(fetch_data[0]);
          return response;
        }
      } else {
        throw {
          type: "Invalid ",
          error_message: "email not valid or account -> blocked or deleted",
        };
      }
    } catch (error) {
      throw error;
    }
  };

  static viewProfile = async (_id: string) => {
    try {
      let query = { _id: _id };
      let projection = { name: 1, email: 1, profile_pic: 1 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options
      );
      return fetch_data[0];
    } catch (error) {
      throw error;
    }
  };

  static editProfile = async (req: any) => {
    try {
      let { name, email } = req.body;
      let files = req.files;
      let { _id } = req.admin_data;

      let update: any = {};
      if (files) {
        let uploaded_data: any = await uploadfile(files);
        let profile_pic = uploaded_data.file_name;
        update.profile_pic = profile_pic;
        console.log("profilepic", profile_pic);
      }
      if (name) {
        update.name = name;
        console.log("name", name, typeof name);
      }
      if (email) {
        update.email = email;
        console.log("email", email, typeof email);
      }
      let query = { _id: _id };
      let options = { new: true };
      console.log("update", update);
      let updated_data: any = await DAO.findAndUpdate(
        Models.Admin,
        query,
        update,
        options
      );
      let response = {
        status: "success",
        message: "Profile Updated Successfully",
        admin: {
          name: updated_data.name,
          email: updated_data.email,
          profile_pic: updated_data.profile_pic,
        },
      };
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  static addUser = async (req: any) => {
    try {
      let { name, email, phone_number, password } = req.body;
      let files = req.files;
      let profile_pic;
      if (files) {
        let uploaded_data: any = await uploadfile(files);
        profile_pic = uploaded_data.file_name;
        console.log("profilepic", profile_pic);
      }
      let query = { email: email };
      let projection = { email: email };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.User,
        query,
        projection,
        options
      );
      if (fetch_data.length > 0) {
        throw {
          type: "Email Already Exists",
          error_message: "this email is already exists ",
        };
      } else {
        let email_otp = await helpers.GenerateOtp();
        let hash = await bcryptPassword(password);
        let data_to_save = {
          name: name,
          email: email,
          phone_number: phone_number,
          password: hash,
          email_otp: email_otp,
          profile_pic: profile_pic,
        };
        let saved_user: any = await DAO.saveData(Models.User, data_to_save);
        let response = {
          status: "success",
          message: "User Added Successfully",
          admin: { name: saved_user.name },
        };
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  static listUser = async (status: any, search_name: any) => {
    try {
      let query: any = {};
      if (status && !search_name) {
        query = {
          status: status,
        };
      }
      if (!status && search_name) {
        query = { name: { $regex: `^`+search_name, $options: "i" } };
      }
      if (status && search_name) {
        query = {
          status: status,
          name: search_name,
        };
      }
      if (!status && !search_name) {
        query = {};
      }
      console.log("queryis", query);
      let projection = {
        name: 1,
        email: 1,
        phone_number: 1,
        status: 1,
        profile_pic: 1,
      };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.User,
        query,
        projection,
        options
      );
      return fetch_data;
    } catch (error) {
      throw error;
    }
  };

  static userDetail = async (_id: any) => {
    try {
      let query = { _id: _id };
      let projection = { _v: 0, password: 0, email_otp: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.User,
        query,
        projection,
        options
      );
      if (fetch_data.length > 0) {
        return fetch_data[0];
      } else {
        throw { type: "User Not Found", error_message: "User Not Found" };
      }
    } catch (error) {
      throw error;
    }
  };

  static editUser = async (user_id: any, status: any) => {
    try {
      let query = { _id: user_id };
      let update = { status: status };
      let options = { new: true };
      let updated_data: any = await DAO.findAndUpdate(
        Models.User,
        query,
        update,
        options
      );
      return updated_data;
    } catch (error) {
      console.log(error);
    }
  };

  static deleteUser = async (user_id: any) => {
    try {
      let query = { _id: user_id };
      let update = { is_deleted: true };
      let options = { new: true };
      let updated_data: any = await DAO.findAndUpdate(
        Models.User,
        query,
        update,
        options
      );
      return updated_data;
    } catch (error) {
      console.log(error);
    }
  };

  static addProduct = async (req: any) => {
    try {
      let data_to_save = req.body;
      let saved_product = await DAO.saveData(Models.Product, data_to_save);
      return saved_product;
    } catch (error) {
      throw error;
    }
  };

  static listProducts = async (req:any) => {
    try {
       let query: any;
      let { category , price } = req.query;
      if(category && !price){
          query = { category: category}
      }
      if(!category && price){ query= { sales_price:{ $lte: price }}}
      if(category && price ) { query = { category: category, sales_price: { $lte: price }}}
      let projection = {
        _id: 1,
        name: 1,
        category: 1,
        sales_price: 1,
        coverimage: 1,
      };
      if (!category && !price){ query={}}
      console.log("query",query)
      let response = await DAO.getData(Models.Product, query, projection, {
        lean: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  static productDetail = async (_id: any) => {
    try {
      let query = { _id: _id };
      let projection = { _v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Product,
        query,
        projection,
        options
      );
      if (fetch_data.length > 0) {
        fetch_data[0].discount = (fetch_data[0].regular_price-fetch_data[0].sales_price)*100/(fetch_data[0].regular_price)
        return fetch_data[0];
      } else {
        throw { type: "User Not Found", error_message: "User Not Found" };
      }
    } catch (error) {
      throw error;
    }
  };

  static editProduct = async (req: any) => {
    try {
      let { name, category, description, images, regular_price, sales_price } =
        req.body;

      let { _id } = req.params;
      console.log(_id);
      let update: any = {};
      if (name) {
        update.name = name;
      }
      if (category) {
        update.category = category;
      }
      if (description) {
        update.description = description;
      }
      if (images) {
        update.images = images;
      }
      if (regular_price) {
        update.regular_price = regular_price;
      }
      if (sales_price) {
        update.sales_price = sales_price;
      }

      let query = { _id: _id };
      let options = { new: true };
      console.log("update", update);
      let updated_data: any = await DAO.findAndUpdate(
        Models.Product,
        query,
        update,
        options
      );
      console.log(updated_data);
      return updated_data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static hideProduct = async (req: any) => {
    try {
      let { _id } = req.params;
      let query = { _id: _id };
      let update = { visibility: false };
      let options = { new: true };
      let updated_data: any = await DAO.findAndUpdate(
        Models.Product,
        query,
        update,
        options
      );
      return updated_data;
    } catch (error) {
      throw error;
    }
  };

  static addPage = async (req: any, models: any) => {
    try {
      let data_to_save = req.body;
      let response = await DAO.saveData(models, data_to_save);
      return response;
    } catch (error) {
      throw error;
    }
  };

  static listPages = async (models: any) => {
    try {
      let response = await DAO.getData(models, {}, { _v: 0 }, { lean: true });
      return response;
    } catch (error) {
      throw error;
    }
  };

  static pageDetail = async (req: any, models: any) => {
    try {
      let { _id } = req.params;
      let response = await DAO.getData(
        models,
        { _id: _id },
        { _v: 0 },
        { lean: true }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  static editPage = async (req: any) => {
    try {
      let { _id } = req.params;
      let { title, description, image } = req.body;
      let query = { _id: _id };
      let update: any = {};
      if (title) {
        update.title = title;
      }
      if (description) {
        update.description = description;
      }
      if (image) {
        update.image = image;
      }
      let options = { new: true };
      let response = await DAO.getData(Models.Page, query, update, options);
      return response;
    } catch (error) {
      throw error;
    }
  };

  static editFaq = async (req: any) => {
    try {
      let { _id } = req.params;
      let { question, answer } = req.body;
      let query = { _id: _id };
      let update = { question, answer };
      let options = { new: true };
      let response = await DAO.getData(Models.Faq, query, update, options);
      return response;
    } catch (error) {
      throw error;
    }
  };

  static addContact = async (req: any) => {
    try {
      let data_to_save = req.body;
      let response = await DAO.saveData(Models.Contact, data_to_save);
      return response;
    } catch (error) {
      throw error;
    }
  };

  static listContacts = async (req: any) => {
    try {
      let query = {};
      let projection = { __V: 0 };
      let options = { lean: true };
      let response = await DAO.getData(
        Models.Contact,
        query,
        projection,
        options
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  static editContact = async (req: any) => {
    try {
      let { _id } = req.params;
      let { status } = req.query;
      let update = { status: status };
      let query = { _id };
      let options = { new: true };
      let response = await DAO.findAndUpdate(
        Models.Contact,
        query,
        update,
        options
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  static deleteContact = async (req: any) => {
    try {
      let { _id } = req.params;
      let query = { _id: _id };
      let updated_data: any = await DAO.removeData(Models.Contact, query);
      return updated_data;
    } catch (error) {
      console.log(" this is error --------->>>", error);
      throw error;
    }
  };

  static createNotification = async (body: any) => {
    //selects -> All/Selected , sendto -> [email,email.....]
    try {
      let { selects, send_to, notificationType } = body;
      console.log("selects", selects);
      console.log("notificationType",notificationType)
      if (selects == "All") {
        let fetch_email:any = await DAO.getData(
          Models.User,
          {},
          { email: 1 ,_id:0},
          { lean: true }
        );
        let emails: any=[]
        for(let x of fetch_email){
          emails.push(x.email)
        }
        console.log("emails", emails)
      
        if (notificationType == "Push") {
          let response = await this.sendPushNotification(body, emails);
          return response;
        }
        if ((notificationType = "Email")) {
          let response = await this.sendEmailNotification(body, emails);
          return response;
        }
      }
      if (selects == "Selected") {
        // let emails = await DAO.getData(Models.User,{email: {$in: send_to}}, {email: 1}, {lean: true})
        // console.log("selected",emails)
        let { send_to: emails } = body;
        if (notificationType == "Push") {
          let response = await this.sendPushNotification(body, emails);
          return response;
        }
        if ((notificationType = "Email")) {
          let response = await this.sendEmailNotification(body, emails);
          return response;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  static sendEmailNotification = async (body: any, emails: any) => {
    try {
      let subject = body.subject;
      let description = body.description;
      for (let email of emails) {
        await sendEmail(email, subject, "", description);
      }
      return {
        type: "SUCCESS",
        message: "Email Notification Send Successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static sendPushNotification = async (body: any, emails: any) => {
    try {
      let fetch_ids: any = await DAO.getData(
        Models.User,
        { email: { $in: emails } },
        { _id: 1 },
        { lean: true }
      );
      for (let id of fetch_ids) {
        let query = { _id: id, fcm_token: { $ne: null } };
        let projection = { fcm_token: 1 };
        let options = { sort: -1, limit: 1, lean: true };
        let token = await DAO.getSingleData(
          Models.Sessions,
          query,
          projection,
          options
        );
        console.log("token", token)
        let data = {
          title: body.subject,
          message: body.description,
        };
        console.log("data", data)
        await sendNotification(data, token);
      }
      return { type: "Success", message: "Push Notification sent" };
      // let options= {};
      // let groups = [{$match:{email:{ $in : emails}}},{$lookup:{}}]
      // let fetch_data = await DAO.aggregateData(Models.User, groups, options)
    } catch (error) {
      return error;
    }
  };

  static addStaff = async (req: any) => {
    try {
      let data_to_save = req.body;
      let saved_product = await DAO.saveData(Models.Product, data_to_save);
      return saved_product;
    } catch (error) {
      throw error;
    }
  };

  static listStaffs = async () => {
    try {
      let projection = {
        password: 0,
      };
      let response = await DAO.getData(Models.Staff, {}, projection, {
        lean: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  static staffDetail = async (req: any, models: any) => {
    try {
      let { _id } = req.params;
      let response = await DAO.getData(
        models,
        { _id: _id },
        { _v: 0, password: 0 },
        { lean: true }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  static editStaff = async (req: any) => {
    try {
      let { _id } = req.params;
      let update = req.body;
      let query = { _id };
      let options = { new: true };
      let response = await DAO.findAndUpdate(
        Models.Contact,
        query,
        update,
        options
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  static deleteStaff = async (req: any) => {
    try {
      let { _id } = req.params;
      let query = { _id: _id };
      let updated_data: any = await DAO.removeData(Models.Staff, query);
      return updated_data;
    } catch (error) {
      console.log(" this is error --------->>>", error);
      throw error;
    }
  };

  static dashboard = async (req: any) => {
    try {
      let query = {};
      let user = await DAO.countData(Models.User, query);
      let product = await DAO.countData(Models.Product, query);
      let userlist = await this.listUser(null, null);
      let response = {
        user,
        product,
        userlist,
      };
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
