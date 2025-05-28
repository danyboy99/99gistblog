const express = require("express");
const Blog = require("../model/blogs");

const router = express.Router();

router.get("/", async (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  const Blogs = await Blog.find();
  let catigory = [];
  Blogs.forEach((blog) => {
    catigory.push(blog.catigory);
  });
  return res.render("index", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    Blogs,
    catigory,
  });
});

router.get("/blog/:id", async (req, res) => {
  const blogId = req.params.id;
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  const singleBlog = await Blog.findById(blogId);
  const Blogs = await Blog.find();
  let first5Blog = Blogs.slice(0, 5);
  let catigory = [];
  Blogs.forEach((blog) => {
    catigory.push(blog.catigory);
  });
  return res.render("Blog", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    Blog: singleBlog,
    Blogs,
    catigory,
    preview: first5Blog,
  });
});

router.get("/catigory/:cat", async (req, res) => {
  const inputedCatigory = req.params.cat;
  const foundBlogs = await Blog.find({ catigory: inputedCatigory });
  let errMsg = req.flash("error");
  console.log("found Blog:", foundBlogs);
  let successMsg = req.flash("success");
  const Blogs = await Blog.find();
  let catigory = [];
  Blogs.forEach((blog) => {
    catigory.push(blog.catigory);
  });
  return res.render("catigory", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    Blogs: foundBlogs,
    catigory,
  });
});

module.exports = router;
