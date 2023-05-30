const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = mongoose.Schema({
  name: { type: String, default: null },
  profile_pic: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  Role: { type:String, default: null},
  phone_number: { type: Number, default: null },
});
const Staff = mongoose.model("staffs", staffSchema);
export default Staff;
