const mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
  question: { type: String, default: null },
  answer: { type: String, default: null },
});

const Faq = mongoose.model("faqs", faqSchema);
export default Faq;
