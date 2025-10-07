const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin layout settings
const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// Middleware to protect admin routes
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

// Admin Dashboard Route
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Admin Dashboard",
      description: "Admin dashboard for managing blog posts",
    };

    res.render("admin/index", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("Error fetching posts for admin:", error);
  }
});

// Admin Login Route
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isPasswordValid = await bycrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("admin/dashboard");
  } catch (error) {
    console.error("Error logging in admin:", error);
  }
});

// Get Admin Dashboard Route
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Admin dashboard for managing blog posts",
    };
    const data = await Post.find().lean();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("Error fetching posts on the admin dashboard:", error);
  }
});

// Get Add New Post Route
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add New Post",
      description: "Admin dashboard for managing blog posts",
    };
    const data = await Post.find().lean();
    res.render("admin/add-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("Error fetching posts for admin dashboard:", error);
  }
});

// Post Add New Post Route
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await newPost.save();
      console.log("Post added successfully:");
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  } catch (error) {
    console.error("Error fetching posts for admin dashboard:", error);
  }
});

// Get Edoit post
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Admin dashboard for managing blog posts",
    };
    const postId = req.params.id;
    const data = await Post.findById(postId).lean();
    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("Error fetching posts for admin dashboard:", error);
  }
});

// Put Edit Post Route
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndUpdate(postId, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/admin/edit-post/${postId}`);
  } catch (error) {
    console.error("Error editing posts from admin dashboard:", error);
  }
});

// Delete Post Route
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting post from admin dashboard:", error);
  }
});

// Admin Login Route
// router.post("/", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log(req.body);

//     if (username === "admin" && password === "admin") {
//       res.send("Login Successful");
//     } else {
//       res.send("Invalid credentials");
//     }

//     // Optional: redirect after login success
//     res.redirect("/admin");
//   } catch (error) {
//     console.error("Error logging in admin:", error);
//   }
// });

// Admin Registration Route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bycrypt.hash(password, 10);
    try {
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User registered successfully" + newUser);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Username already exists");
    }
    console.error("Error registering user:", error);
  }
});

module.exports = router;
