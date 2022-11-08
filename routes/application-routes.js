const express = require("express");
const router = express.Router();
const blogsDao = require("../modules/blogs-dao");
const userDao = require("../modules/users-dao.js");
const jsonSearch = require('search-array').default

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
  const avatarIconsArr = await userDao.retrieveAllAvatarIconUrls();

  const newBlogsArr = [];


  //Remove HTML tag when loading data from SQLite
  function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');};


  //Loop through each blog, if the user is the author of the blog, then userLoggedin will be true. This will allow the user to delete/edit that blog
  //Loop through each blog, remove HTML tag from content
  // We are looping through the blogs array. We create new property called userLoggedIn. If authorId(from blogs) = res.locals.user.id, then userLoggedIn is true, otherwise its false.
  //Then we can render the blog delete/edit buttons on the home page Only if userLoggedIn is true.

  blogsArr.forEach(function (element) {
     if (res.locals.user) {
    
      if (element.authorId == res.locals.user.id) {
        element.userLoggedIn = true;
      } else {
        element.userLoggedIn = false;
      }
      element.noHTMLContent=removeTags(element.content);
      newBlogsArr.push(element);
      } else {
      element.userLoggedIn = false;
      element.noHTMLContent=removeTags(element.content);
      newBlogsArr.push(element);
    }
    
  });

  //We add user icons to the blogs. We see if icon id matches blog author id and then add icon to that blog
  //We use a nested loop to compare loops

  for (let i = 0; i < newBlogsArr.length; i++) {
    for (let j = 0; j < avatarIconsArr.length; j++) {
      if (newBlogsArr[i].authorId == avatarIconsArr[j].id) {
        newBlogsArr[i].avatarIconUrl = avatarIconsArr[j].avatarIconUrl;
      }
    }
  }

  res.locals.newBlogsArr = newBlogsArr;
  res.render("home", { homeActive: true });
  
});

// router for /modal -sending data of the current blog clicked
router.post("/modal", async function (req,res){
      const blogsArr = await blogsDao.allBlogs();
      const blogId = req.body.blogId;
      const avatarIconsArr = await userDao.retrieveAllAvatarIconUrls();

           for (let i = 0; i < blogsArr.length; i++)
            {
              for (let j = 0; j < avatarIconsArr.length; j++)
               {
                   if (blogsArr[i].authorId == avatarIconsArr[j].id)
                    {
                   blogsArr[i].avatarIconUrl = avatarIconsArr[j].avatarIconUrl;
                    }
                }
            }
      res.locals.blogsArr = blogsArr;
      const modalBlog = await blogsDao.findOneBlog(blogId);
      blogsArr.forEach(function (element)
       {
           if( modalBlog.id == element.id)
           {
            res.send(element);
          }
      })
      });
     
module.exports = router;
