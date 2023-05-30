import express from "express";
const router = express.Router();
import adminController from "./admin.controller";
import { authorization } from "../../middlewares";
import { email_auth } from "../../middlewares";

router.post("/signup", adminController.signUp);

router.post("/email-verify", email_auth, adminController.emailVerification);
router.post("/resend-otp-email", adminController.resendEmailOtp);

router.put("/forgot-password", adminController.forgotPassword);
router.put("/reset-password", email_auth, adminController.resetPassword);
router.put("/change-password", authorization, adminController.changePassword);

router.post("/login", adminController.logIn);

router.get("/profile", authorization, adminController.viewProfile);
router.patch("/profile", authorization, adminController.editProfile);

router.post("/user", authorization, adminController.addUser);
router.get("/user", authorization, adminController.listUsers);
router.get("/user/:_id", authorization, adminController.userDetail);
router.patch("/user/:_id", authorization, adminController.editUser);
router.delete("/user/:_id", authorization, adminController.deleteUser);

router.post("/product", authorization, adminController.addProduct);
router.get("/product", authorization, adminController.listProducts);
router.get("/product/:_id", authorization, adminController.productDetail);
router.patch("/product/:_id", authorization, adminController.editProduct);
router.delete("/product/:_id", authorization, adminController.hideProduct);

router.post("/page", authorization, adminController.addPage);
router.get("/page", authorization, adminController.listPages);
router.get("/page/:_id", authorization, adminController.pageDetail);
router.patch("/page/:_id", authorization, adminController.editPage);

router.post("/faq", authorization, adminController.addFAQ);
router.get("/faq", authorization, adminController.listFAQs);
router.get("/faq/:_id", authorization, adminController.FAQDetail);
router.patch("/faq/:_id", authorization, adminController.editFAQ);

router.post("/contact", authorization, adminController.addContact);
router.get("/contact", authorization, adminController.listContacts);
router.patch("/contact/:_id", authorization, adminController.editContact)
router.delete("/contact/:_id", authorization, adminController.deleteContact);

router.post("/notification", authorization, adminController.createNotification)

router.post("/staff", authorization, adminController.addStaff);
router.get("/staff", authorization, adminController.listStaffs);
router.get("/staff/:_id", authorization, adminController.staffDetail);
router.patch("/staff/:_id", authorization, adminController.editStaff);
router.delete("/staff/:_id", authorization, adminController.deleteStaff);

router.get('/dashboard', authorization, adminController.dashboard)


export default router;
