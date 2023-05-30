const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const status = ["Active", "Deactive", "Block", "Unblock"];
const userSchema = mongoose.Schema({
  name: { type: String, default: null },
  profile_pic: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  phone_number: { type: Number, default: null },
  email_otp: { type: String, default: null },
  otp_expire_in: { type: Date, default: null },
  status: { type: String, default: "Active", enum: status },
  is_email_verified: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: +new Date() },
  updated_at: { type: Date, default: +new Date() },
  products: [{type:String, default: null}],
});

const User = mongoose.model("users", userSchema);
export default User;
