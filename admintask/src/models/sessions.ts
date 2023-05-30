const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const device_type = ["ANDROID", "IOS", "WEB"]
const sessionSchema = mongoose.Schema({
  admin_id: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  user_id: { type: Schema.Types.ObjectId, ref: "Person", default: null },
  access_token: { type: String, default: null },
  token_gen_at: { type: Date },
  created_at: { type: Date, default: +new Date() },
  fcm_token: { type: String, default: null },
  device_type: { type: String, default:"WEB", enum:device_type}
});

const Sessions = mongoose.model("sessions", sessionSchema);
export default Sessions;
