const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
  title: { type: String, default: null },
  description: { type: String, default: null },
  image:{type: String, default: null},
  created_at: { type: Date, default: +new Date() },
});

const Page = mongoose.model("pages", pageSchema);
export default Page;
