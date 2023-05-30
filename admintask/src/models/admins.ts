const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = mongoose.Schema({
  name: { type: String, default: null },
  profile_pic: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  phone_number: { type: Number, default: null },
  email_otp: { type: String, default: null },
  otp_expire_in: { type: Date, default: null },
  is_email_verified: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: +new Date() },
  updated_at: { type: Date, default: +new Date() },
});

const Admin = mongoose.model("admins", adminSchema);
export default Admin;
