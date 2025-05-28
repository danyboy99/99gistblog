const mongoose = require("mongoose");
const { Schema } = mongoose;

let currentDate = Date.now();
const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: currentDate },
  images: [{ type: String }],
  catigory: { type: String, required: true },
});

const blog = mongoose.model("blog", blogSchema);

module.exports = blog;
