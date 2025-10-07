require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const main = require("./routes/main");
const admin = require("./routes/admin");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const session = require("express-session");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 4000;
app.use(express.static("public"));

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    // cookie: { maxAge: 1000 * 60 * 60 * 48 }, // 2 days
  })
);

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");
app.use(expressLayout);

app.use("/", main);
app.use("/admin", admin);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
