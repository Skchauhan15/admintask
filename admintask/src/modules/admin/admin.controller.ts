import { handleCatch, handleSuccess, helpers } from "../../middlewares";
import services from "./admin.services";
import * as email_services from "../../middlewares/email_services";
import moment from "moment";
import * as Models from "../../models";
import { response } from "express";

export default class controller {
  static signUp = async (req: any, res: Express.Response) => {
    try {
      let { email, name, password } = req.body;
      let query_email = { email: email };

      let admin_detail: any = await services.verifyAdminInfo(query_email);
      if (admin_detail.length) {
        throw { type: "Invalid Signup", error_message: "Email already exits" };
      } else {
        let admin_created: any = await services.createAdmin(req.body);
        let { _id } = admin_created;
        let saved_session: any = await services.token_Generate_and_SaveSession(
          _id,
          req.body
        );
        let response: any = await services.make_admin_response(saved_session);

        await email_services.sendWelcomeMail(admin_created);
        handleSuccess(res, response);
      }
    } catch (error) {
      handleCatch(res, error);
    }
  };
  static emailVerification = async (req: any, res: Express.Response) => {
    try {
      let { otp: input_otp } = req.body;
      let { _id, email_otp } = req.admin_data;
      if (input_otp == email_otp) {
        let verified_admin: any = await services.verify_email_otp(_id);
        let response: any = {
          message: "email verified successfully ",
          admin: verified_admin,
        };
        handleSuccess(res, response);
      } else {
        throw { type: "WRONG OTP", error_message: " your Otp is not valid" };
      }
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static resendEmailOtp = async (req: any, res: Express.Response) => {
    try {
      let { email } = req.body;
      let data: any = await services.resend_email_otp(email);
      let { _id, email_otp } = data;
      let generateToken: any = await services.emailToken(_id, email);
      await email_services.resendOtpMail(data);
      let response: any = {
        type: "successfull",
        message: "OTP SENT SUCCESSFULLY",
        access_token: generateToken,
      };
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static forgotPassword = async (req: any, res: Express.Response) => {
    try {
      let { email } = req.body;
      let data: any = await services.reset_password_otp(email);
      let { _id, email_otp } = data;
      let generateToken: any = await services.emailToken(_id, email_otp);
      await email_services.forgotPasswordMail(data);
      let response: any = {
        type: "successfull",
        message: "OTP SENT SUCCESSFULLY",
        access_token: generateToken,
      };
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static resetPassword = async (req: any, res: Express.Response) => {
    try {
      let { otp: input_otp, new_password } = req.body;
      let { _id, email_otp, otp_expire_in } = req.admin_data;

      let diff = await helpers.get_diff(otp_expire_in);
      if (input_otp == email_otp && diff > 0) {
        let verified_data: any = await services.verify_pass_otp(_id, input_otp);
        let reset_data: any = await services.resetPassword(_id, new_password);
      } else {
        throw {
          type: "WRONG OTP",
          error_message: "your otp is invalid or expired",
        };
      }
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static changePassword = async (req: any, res: Express.Response) => {
    try {
      let { _id, password } = req.admin_data;
      let { old_password, new_password } = req.body;
      if (password == old_password) {
        let response = await services.resetPassword(_id, new_password);
        handleSuccess(res, response);
      } else {
        throw { type: "ERROR", error_message: "old_password is not valid " };
      }
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static logIn = async (req: any, res: Express.Response) => {
    try {
      let { email, password } = req.body;
      let response = await services.logIn(email, password, req.body);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static viewProfile = async (req: any, res: Express.Response) => {
    try {
      let { _id } = req.admin_data;
      let response = await services.viewProfile(_id);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editProfile = async (req: any, res: Express.Response) => {
    try {
      let response = await services.editProfile(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static addUser = async (req: any, res: Express.Response) => {
    try {
      let response = await services.addUser(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static listUsers = async (req: any, res: Express.Response) => {
    try {
      let { status,name } = req.query;
      console.log(req.query);
      let response = await services.listUser(status, name);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static userDetail = async (req: any, res: Express.Response) => {
    try {
      console.log(req.params);
      let { _id: user_id } = req.params;
      let response = await services.userDetail(user_id);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editUser = async (req: any, res: Express.Response) => {
    try {
      let { status } = req.query;
      let { _id: user_id } = req.params;
      console.log(user_id);
      console.log(status);
      let edited_user = await services.editUser(user_id, status);
      console.log(edited_user);
      let response = await services.userDetail(edited_user._id);
      console.log("response", response);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static deleteUser = async (req: any, res: Express.Response) => {
    try {
      let { _id: user_id } = req.params;
      let deleted_user = await services.deleteUser(user_id);
      let response = await services.userDetail(deleted_user._id);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static addProduct = async (req: any, res: Express.Response) => {
    try {
      let response = await services.addProduct(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static listProducts = async (req: any, res: Express.Response) => {
    try {
      let response = await services.listProducts(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static productDetail = async (req: any, res: Express.Response) => {
    try {
      let { _id } = req.params;
      let response = await services.productDetail(_id);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editProduct = async (req: any, res: Express.Response) => {
    try {
      let response = await services.editProduct(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };
  static hideProduct = async (req: any, res: Express.Response) => {
    try {
      let response = await services.hideProduct(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static addPage = async (req: any, res: Express.Response) => {
    try {
      let response = await services.addPage(req, Models.Page);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static listPages = async (req: any, res: Express.Response) => {
    try {
      let response = await services.listPages(Models.Page);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };
  static pageDetail = async (req: any, res: Express.Response) => {
    try {
      let response = await services.pageDetail(req, Models.Page);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editPage = async (req: any, res: Express.Response) => {
    try {
      let response = await services.editPage(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static addFAQ = async (req: any, res: Express.Response) => {
    try {
      let response = await services.addPage(req, Models.Faq);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static listFAQs = async (req: any, res: Express.Response) => {
    try {
      let response = await services.listPages(Models.Faq);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };
  static FAQDetail = async (req: any, res: Express.Response) => {
    try {
      let response = await services.pageDetail(req, Models.Faq);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editFAQ = async (req: any, res: Express.Response) => {
    try {
      let response = await services.editFaq(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static addContact = async (req: any, res: Express.Response) => {
    try {
      let response = await services.addContact(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static listContacts = async (req: any, res: Express.Response) => {
    try {
      let response = await services.listContacts(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editContact = async (req: any, res: Express.Response) => {
    try {
      let response = await services.editContact(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static deleteContact = async (req: any, res: Express.Response) => {
    try {
      let response = await services.deleteContact(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static createNotification = async (req: any, res: Express.Response) => {
    try {
      let response = await services.createNotification(req.body);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, response);
    }
  };

  static addStaff = async (req: any, res: Express.Response) => {
    try {
      let response = await services.addStaff(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static listStaffs = async (req: any, res: Express.Response) => {
    try {
      let response = await services.listStaffs();
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };
  static staffDetail = async (req: any, res: Express.Response) => {
    try {
      let response = await services.staffDetail(req, Models.Staff);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static editStaff = async (req: any, res: Express.Response) => {
    try {
      let response = await services.editStaff(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };
  static  deleteStaff = async (req: any, res: Express.Response) => {
    try {
      let response = await services.deleteStaff(req);
      handleSuccess(res, response);
    } catch (error) {
      handleCatch(res, error);
    }
  };

  static dashboard = async ( req: any, res: Express.Response ) => {
    try {
      let response = await services.dashboard( req )
      handleSuccess(res, response)
    } catch (error) {
      handleCatch(res, error)
    }
  }
}
