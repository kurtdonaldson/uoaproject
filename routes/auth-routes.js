const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const crypto = require("crypto");

const xlsx = require ("xlsx");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    cb(null, name);
  },
});


const uploadExcel = multer({storage: storage});
const uploadImage = multer({storage: storage});


// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao-pg");

//The DAO that handles blogs.
const blogsDao = require("../modules/blogs-dao-pg");
const { application } = require("express");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");


//Handle image uploaded via tinyMCE
router.post("/form", uploadImage.single('file'), async function (req, res) {
  res.json({
    location: "/uploads/" + req.file.filename,
  });
});


//Handle excel file uploaded by user. 
router.post("/import",uploadExcel.single("importExcel"), async function(req, res){
  try{
  var ext = path.extname(req.file.originalname);
  const excel = xlsx.readFile("./public/uploads/" + req.file.filename);
  const excelData = xlsx.utils.sheet_to_json(excel.Sheets['Blog']);
  const dataLength = excelData.length;
  
  //check if the uploaded file is .xlsx or xls, if not, send error message to user and remove the uploaded file
  if(ext !== '.xlsx' && ext !== '.xls') {
    blogsDao.removeUploadedDocument(req.file.filename);
    res.setToastMessage(`Import failed. Only Excel File (.xlsx and .xls) can be uploaded`)
    res.redirect("/");}
  else if(dataLength==0){
    //error message when no data is found in the uploaded document
    blogsDao.removeUploadedDocument (req.file.filename)
    res.setToastMessage(`No data is found in the uploaded document. Upload failed.`)
    res.redirect("/");}
  
    else{
    //Code to extract data from excel file
    try {
      for(i=0;i<excelData.length;i++){
          const blogContentHtml = "<p>" + excelData[i].BlogContent + "</P>";
          const authorId = res.locals.user.id;
          const blogTitle = excelData[i].BlogTitle;
          const imgSource = "template/imagesComingSoon.jpg";
 
          await blogsDao.newBlog(
            authorId,
            blogContentHtml,
            imgSource,
            blogTitle
            ); }  
      
        //remove uploaded excel file after data is read to database
        blogsDao.removeUploadedDocument (req.file.filename);

        res.setToastMessage("New blog post created!");
        res.redirect("/");
        } catch {
          blogsDao.removeUploadedDocument (req.file.filename);
          res.setToastMessage(`An error has occurred => ${err}`);
          res.redirect("/");
        }}

        }
        catch{
          res.setToastMessage(`No import file attached. Import failed`);
          res.redirect("/");
        }});

//Handle information from new blog form. Save details from form to database. 
router.post("/newblog",uploadImage.single("imageUrl"), async function(req, res){
  //Code to extract image source to save to database
  const blogHtml = req.body.blog;
                          

  //Code to extract content html
  const blogContentHtml = req.body.blog;
  const authorId = res.locals.user.id;
  const blogTitle = req.body.blogTitle;

  const imgSource = "uploads/" + req.file.filename;

  //check if the uploaded file is .xlsx or xls, if not, send error message to user and remove the uploaded file
  var ext = path.extname(req.file.originalname);
  if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.bmp') {
    blogsDao.removeUploadedDocument(req.file.filename);
    res.setToastMessage(`Cover image upload failed. Only Image File (.jpg, .png, .jpeg,,bmp) can be uploaded`)
    res.redirect("/");}
  else{
  try {
      await blogsDao.newBlog(
      authorId,
      blogContentHtml,
      imgSource,
      blogTitle
    );


    res.setToastMessage("New blog post created!");
    res.redirect("/");
  } catch {
    res.setToastMessage(`An error has occurred => ${err}`);
    res.redirect("/");
  }}
})


//Delete route handler. Receive the blogId from the fetch request. Use this id to find and delete the blog on the database.
router.delete("/deleteBlog", verifyAuthenticated, async function (req, res) {
  const blogId = req.body.blogId;

  try {
    const deleteBlog = await blogsDao.deleteBlog(blogId);
    res.setToastMessage("Blog post deleted!");
    res.redirect("/myBlogs");
  } catch {
    res.setToastMessage(`An error has occurred => ${err}`);
    res.redirect("/myBlogs");
  }
});

//Get route for edit page. This will load edit page and populate form with current blog information.
router.get("/blogs/:id/edit", verifyAuthenticated, async function (req, res) {
  const blogId = req.params.id;

  try{
  const blog = await blogsDao.findOneBlog(blogId);
  //Conditional statement to check that author and user are the same. Will only allow author to edit their own blogs
  res.locals.blog = blog;
  if(res.locals.user.id == blog.authorId){
    res.render("editBlog");
  }else{
    res.setToastMessage("Unauthorised access attempted!");
    res.redirect("/")
  }
  }catch(err){
    res.setToastMessage(`An error has occurred => ${err}`);
    res.redirect("/")
  }
});

//Put route for edit form. Need to change blog id to integer as it come through as a string.
router.put("/blogs/:id", uploadImage.single("imageUrl"), async function (req, res) {
  let imageUrl;
  //To check if the user has updated the cover image.
  try{
    imageUrl = "uploads/" + req.file.filename;
    //check if the uploaded file is an image file, if not, send error message to user and remove the uploaded file
    var ext = path.extname(req.file.originalname);
    if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.bmp') {
      blogsDao.removeUploadedDocument(req.file.filename);
      res.setToastMessage(`Cover image upload failed. Only Image File (.jpg, .png, .jpeg,,bmp) can be uploaded`)
      imageUrl = req.body.backUpImageUrl;}

  }
  catch{
    imageUrl = req.body.backUpImageUrl;
  }
  
  const content = req.body.blog;
  const blogId = parseInt(req.body.blogId);
  const blogTitle = req.body.blogTitle;

  const updatedBlog = await blogsDao.editBlog(
    blogId,
    blogTitle,
    content,
    imageUrl
  );

  res.redirect("/");}
);

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {
  // Get the username and password submitted in the form
  const username = req.body.username;
  const password = req.body.password;

  //We use a try catch to first check if the user with that username exists
  //If not, we use catch to say there's an authentication error.
  try {
    // Find a matching user in the database
    const user = await userDao.retrieveUserByUsername(username);

    //Use bcrypt to compare user input password to hashed database password.
    const validPassword = await bcrypt.compare(password, user.password);

    // if there is a matching user..
    if (validPassword) {
      // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
      const authToken = uuid();
      user.authToken = authToken;
      await userDao.updateUser(user);
      res.cookie("authToken", authToken);
      res.locals.user = user;
      res.redirect("/");
    }

    // If password doesn't match
    else {
      // Auth fail
      res.locals.user = null;
      res.setToastMessage("Authentication failed!");
      res.redirect("./login");
    }
  } catch {
    // Otherwise, if there's no matching user...
    res.locals.user = null;
    res.setToastMessage("Authentication failed!");
    res.redirect("./login");
  }
});

////We send a fetch req and send through all the usernames from the databse to make sure the same username can't be used again.
router.post("/usernames", async function (req, res) {
  const usernameEntered = req.body.username.toLowerCase();
  const allUsers = await userDao.retrieveAllUsers();
  const allUsersArray = [];
  allUsers.forEach(function (users) {
    allUsersArray.push(users.username.toLowerCase());
  });

  const result = { userExists: "Username available" };

  if (allUsersArray.includes(usernameEntered)) {
    result.userExists = "Username already exists";
  } else {
    result.userExists = "Username available";
  }

  res.send(result);
});

//This handles the registration form for a new user. Bcrypt used to hash and salt password.
router.post("/register", async function (req, res) {
  const password = req.body.password;

  const hash = await bcrypt.hash(password, 12);

  const newUser = {
    username: req.body.username,
    password: hash,
    name: req.body.name,
    email: req.body.email,
    dob: req.body.dob,
    description: req.body.description,
    avatarIconUrl: req.body.avatarIconUrl,
  };

  try {
    const user = await userDao.createUser(newUser);
    res.setToastMessage("Account created successfully!");
    res.redirect("/login");
  } catch (err) {
    res.setToastMessage(`An error has occurred => ${err}`);
    res.redirect("./register");
  }
});


//Route handler for handling edit account information. 

router.get("/users/:id/edit", async function (req, res) {
  const id = req.params.id;
  const idToInteger = parseInt(id);
  //Check user can only edit their own account
  if(res.locals.user.id === idToInteger){
    const user = await userDao.retrieveUserById(id);
    res.locals.users = user;
    res.render("editAccount");
  }else{
    res.setToastMessage("Unauthorised access attempted!");
    res.redirect("/");
  }
});

//Route handler for editing user account
router.put("/users/:id", async function (req, res) {
  //This was sent through in URL
  const userAccountId = req.params.id;
  const password = req.body.password;

  const hash = await bcrypt.hash(password, 12);

  const updatedUser = {
    userId: userAccountId,
    username: req.body.username,
    password: hash,
    name: req.body.name,
    email: req.body.email,
    dob: req.body.dob,
    description: req.body.description,
    avatarIconUrl: req.body.avatarIconUrl,
  };

  try {
    await userDao.updateUserAccount(updatedUser);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});


//Route handler for handling delete account feature.

router.get("/deleteAccount/:id", verifyAuthenticated, async function (req, res) {
    const userAccountId = req.params.id;

    try {
      await userDao.deleteUser(userAccountId);
      res.setToastMessage("Account deleted!");
      res.redirect("/");
    } catch (err) {
      res.setToastMessage(`An error has occured => ${err}`);
      res.redirect("/");
    }
  }
);

//Route handler for newBlog page. The active properties allow us to make the nav links active when on that particular page. 
router.get("/newBlog", verifyAuthenticated, function (req, res) {
  res.render("newBlog", { newBlogActive: true });
});

//Route handler for myBlogs page. The blogs that match the user id will be populated on the myBlogs page
router.get("/myBlogs", verifyAuthenticated, async function (req, res) {
  const userId = res.locals.user.id;
  res.locals.blogs = await blogsDao.myBlogs(userId);

  res.render("myBlogs", { myBlogsActive: true });
});

module.exports = router;
