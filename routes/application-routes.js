const express = require("express");
const router = express.Router();
const blogsDao = require("../modules/blogs-dao-pg");
const userDao = require("../modules/users-dao-pg");
const jsonSearch = require("search-array").default;

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { LIMIT_WORKER_THREADS } = require("sqlite3");

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
router.get("/login", function (req, res) {
  if (res.locals.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
  res.clearCookie("authToken");
  res.locals.user = null;
  res.setToastMessage("Successfully logged out!");
  res.redirect("./login");
});

//Route handler for new account
router.get("/register", async function (req, res) {
  // const allUsers = await userDao.retrieveAllUsers();
  // res.locals.allUsers = allUsers;
  res.render("register");
});

// Home route. Verification not required as anyone can view all the blogs.
router.get("/", async function (req, res) {
  //We added an if statement here to check if a user is logged in. Otherwise forEach statement wont work.
  const blogsArr = await blogsDao.allBlogs();
  // const blogsArrRows = blogsArr.rows;

  const avatarIconsArr = await userDao.retrieveAllAvatarIconUrls();
  const avatarIconsArrRows = avatarIconsArr.rows;

  const newBlogsArr = [];

  //Remove HTML tag when loading data from SQLite
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  //Loop through each blog, if the user is the author of the blog, then userLoggedin will be true. This will allow the user to delete/edit that blog
  //Loop through each blog, remove HTML tag from content
  // We are looping through the blogs array. We create new property called userLoggedIn. If authorId(from blogs) = res.locals.user.id, then userLoggedIn is true, otherwise its false.
  //Then we can render the blog delete/edit buttons on the home page Only if userLoggedIn is true.

  blogsArr.forEach(function (element) {
    if (res.locals.user) {
      if (element.authorid == res.locals.user.id) {
        element.userLoggedIn = true;
      } else {
        element.userLoggedIn = false;
      }
      element.noHTMLContent = removeTags(element.content);
      newBlogsArr.push(element);
    } else {
      element.userLoggedIn = false;
      element.noHTMLContent = removeTags(element.content);
      newBlogsArr.push(element);
    }
  });

  //We add user icons to the blogs. We see if icon id matches blog author id and then add icon to that blog
  //We use a nested loop to compare loops

  for (let i = 0; i < newBlogsArr.length; i++) {
    for (let j = 0; j < avatarIconsArrRows.length; j++) {
      if (newBlogsArr[i].authorid == avatarIconsArrRows[j].id) {
        newBlogsArr[i].avatariconurl = avatarIconsArrRows[j].avatariconurl;
      }
    }
  }

  //Change timezone to be more concise.
  const timeArray = [];
  newBlogsArr.forEach((x) =>
    timeArray.push(
      JSON.stringify(x.created_at)
        .replace("T", " ")
        .split(".")[0]
        .replace('"', "")
    )
  );

  for (let i = 0; i < newBlogsArr.length; i++) {
    newBlogsArr[i].created_at = timeArray[i];
  }

  // convert AudioBufferSourceNode(content) into readable string
  const contentText = [];
  res.locals.newBlogsArr = newBlogsArr;
  res.render("home", { homeActive: true });
});

// router for /modal -sending data of the current blog clicked
router.post("/modal", async function (req, res) {
  const blogsArr = await blogsDao.allBlogs();
  // const blogsArrRows = blogsArr.rows;
  const blogId = req.body.blogId;
  const avatarIconsArr = await userDao.retrieveAllAvatarIconUrls();

  for (let i = 0; i < blogsArr.length; i++) {
    for (let j = 0; j < avatarIconsArr.length; j++) {
      if (blogsArr[i].authorid == avatarIconsArr[j].id) {
        blogsArr[i].avatariconurl = avatarIconsArr[j].avatariconurl;
      }
    }
  }

  res.locals.blogsArr = blogsArr;

  // convert content buffer to string so it can be read in modal pop up
  blogsArr.forEach((blog) => {
    blog.content = blog.content.toString("utf-8");
  });

  const modalBlog = await blogsDao.findOneBlog(blogId);
  blogsArr.forEach(function (element) {
    if (modalBlog.id == element.id) {
      res.send(element);
    }
  });
});

module.exports = router;
