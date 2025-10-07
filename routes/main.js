const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Home Route
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Nodejs Blog",
      description: "Simple blog built with Nodejs, Express & EJS",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const posts = await Post.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("index", {
      locals,
      posts,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
});

// GET post/:id
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const post = await Post.findById({ _id: slug });
    const locals = {
      title: post.title,
      description: "Simple blog built with Nodejs, Express & EJS",
    };
    res.render("post", { locals, post });
  } catch (error) {
    console.error("Error fetching post:", error);
  }
});

// Search Route
router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    searchTerm = searchNoSpecialChar;
    const post = await Post.find({
      // $text: { $search: searchTerm, $diacriticSensitive: true },
      $or: [
        { title: { $regex: new RegExp(searchTerm, "i") } },
        { body: { $regex: new RegExp(searchTerm, "i") } },
      ],
    });
    const locals = {
      title: "search results for " + searchTerm,
      description: "Simple blog built with Nodejs, Express & EJS",
    };
    res.render("search", { locals, post });
  } catch (error) {
    console.error("Error searching post:", error);
  }
});

// About Route
router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;

// function insertPostDate() {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js",
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic.",
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan.",
//     },
//   ]);
// }

// insertPostDate();
