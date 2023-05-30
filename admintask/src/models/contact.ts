const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = mongoose.Schema({
  // admin_id: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  name: { type: String, default: null },
  profile_pic: { type: String, default: null },
  email: { type: String, default: null },
  phone_number: { type: Number, default: null },
  message: { type: String, default: null },
  status: { type: String, default: "Open", enum: ["Open", "Resolved"] },
});

const Contact = mongoose.model("contacts", contactSchema);
export default Contact;
