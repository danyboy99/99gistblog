const express = require("express");
const Admin = require("../model/admin");
const passport = require("passport");
const bcrypt = require("bcrypt");
const Blog = require("../model/blogs");
const uploadMultiple = require("../config/multer");
const Fs = require("fs");
const path = require("path");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Public routes (accessible without authentication)
router.get("/", (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  return res.render("adminlogin", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
  });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/admin",
    failureFlash: true,
    successRedirect: "/admin/index",
  })
);

// Protected routes (require admin authentication)
router.get("/index", isAdmin, (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  return res.render("main", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
  });
});

router.get("/create", isAdmin, (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  return res.render("createadmin", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
  });
});

router.get("/createblog", isAdmin, (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  return res.render("createblog", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
  });
});

router.get("/showblog", isAdmin, async (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  const Blogs = await Blog.find();
  return res.render("showblog", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    Blogs,
  });
});

router.get("/blog/:id", isAdmin, async (req, res) => {
  let blogId = req.params.id;
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  const showBlog = await Blog.findById(blogId);
  const allBlog = await Blog.find();
  let catigory = [];
  allBlog.forEach((blog) => {
    catigory.push(blog.catigory);
  });
  return res.render("singleblog", {
    successMsg,
    errMsg,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    Blog: showBlog,
    catigory,
    isAdmin: true,
  });
});

router.post("/create", isAdmin, async (req, res) => {
  try {
    const { email, password, name, username } = req.body;
    let hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    const newAdmin = await Admin.create({
      email,
      name,
      password: hashPassword,
      username,
    });
    if (newAdmin) {
      req.flash("success", "Admin account created successfully");
      return res.redirect("/admin/index");
    }
    req.flash("error", "Failed to create admin account");
    return res.redirect("/admin/create");
  } catch (err) {
    req.flash("error", err.message || "An error occurred");
    return res.redirect("/admin/create");
  }
});

router.post("/createblog", isAdmin, async (req, res) => {
  try {
    // First handle the file upload
    uploadMultiple(req, res, async (err) => {
      if (err) {
        // Handle Multer errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size too large (max 4MB per file)" });
        }
        if (err === "Error: Images Only!") {
          return res
            .status(400)
            .json({ error: "Only JPEG, JPG, PNG, and GIF files are allowed" });
        }
        return res
          .status(400)
          .json({ error: err.message || "File upload error" });
      }

      // Get text fields from the form
      const { title, content, catigory } = req.body;

      // Validate required fields
      if (!title || !content || !catigory) {
        return res
          .status(400)
          .json({ error: "Title, content, and category are required" });
      }

      // Get uploaded files
      const files = req.files;
      let errMsg = [];
      let successMsg = [];
      try {
        // Create the blog post with image references
        const newBlog = await Blog.create({
          title,
          content,
          catigory,
          images: files ? files.map((file) => file.filename) : [], // Store filenames in an array
        });
        let message = "Blog post created successfully";
        let blogTitle = newBlog.title;
        successMsg.push(message);
        successMsg.push(blogTitle);
        req.flash("success", successMsg);
        return res.redirect("/admin/createblog");
      } catch (dbError) {
        console.error("Database error:", dbError);
        errMsg.push(dbError.message);
        req.flash("error", errMsg);
        return res.redirect("/admin/createblog");
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/deleteblog/:id", isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Blog.findById(productId);

    if (!product) {
      req.flash("error", "Blog not found");
      return res.redirect("/admin/showblog");
    }

    const imageArray = product.images;
    const responseArray = [];

    // Process each image deletion
    for (const image of imageArray) {
      // Construct correct path to images folder
      const imagePath = path.join(
        __dirname,
        "..",
        "images",
        path.basename(image)
      );

      try {
        await Fs.promises.unlink(imagePath);
        console.log("Image deleted successfully:", imagePath);
        responseArray.push("Image deleted successfully");
      } catch (err) {
        console.error("Failed to delete image:", imagePath, err);
        responseArray.push(`Failed to delete image: ${err.message}`);
      }
    }

    await Blog.findByIdAndDelete(productId);

    // Check for any failures
    let numbersOfImg = 0;
    let errorMessage = "";

    responseArray.forEach((msg) => {
      if (!msg.includes("Image deleted successfully")) {
        numbersOfImg++;
      }
    });

    if (numbersOfImg > 0) {
      errorMessage = `Something went wrong in deleting ${numbersOfImg} image(s)`;
      req.flash("error", errorMessage);
    } else {
      req.flash("success", "Blog deleted successfully");
    }

    return res.redirect("/admin/showblog");
  } catch (error) {
    console.error("Unexpected error:", error);
    req.flash("error", "Internal server error");
    return res.status(500).redirect("/admin/showblog");
  }
});

// Add logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    req.flash("success", "You have been logged out successfully");
    res.redirect("/admin");
  });
});

module.exports = router;
