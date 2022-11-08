const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao");

//Setting up nodemailer for password reset
require("dotenv").config();
const nodemailer = require("nodemailer");

//Set up connection with Mailtrap account
let transport = nodemailer.createTransport({
  service: "Zoho",
  host: process.env.EMAIL_USERNAME,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//Get route for password reset page
router.get("/newPasswordForm", function (req, res) {
  res.render("passwordReset");
});

// An email that contains the reset token with an expiry that allows the user to reset their password.
router.post("/reset-password-email", async function (req, res) {
  const emailInput = req.body.resetEmail;

  try {
    const user = await userDao.retrieveUserByEmail(emailInput);
    if (user) {
      const userEmail = user.email;
      //Set any existing passwordToken used status to used
      await userDao.updatePasswordResetUsedByEmail(userEmail);

      //Create random reset token
      const fpSalt = crypto.randomBytes(64).toString("base64");

      //Insert token into DB
      await userDao.insertResetTokenByEmail(userEmail, fpSalt);

      const mailOptions = {
        from: '"Mr Iguana" <iguanas22@zohomail.com>', // Sender address
        to: `${userEmail}`, // List of recipients
        subject: "Password reset link", // Subject line
        html:
          "To reset your password, please click the link below.\n\nhttp://" +
          process.env.DOMAIN +
          "/user/reset-password?token=" +
          encodeURIComponent(fpSalt) +
          "&email=" +
          userEmail,
      };

      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

      res.setToastMessage(
        "If an account with this email exists, a password reset link will be sent to it"
      );
      res.redirect("/login");
    } else {
      res.setToastMessage(
        "If an account with this email exists, a password reset link will be sent to it"
      );
      res.redirect("/login");
    }
  } catch (err) {
    res.setToastMessage(`An error has occured => ${err}`);
    res.redirect("/login");
  }
});

//After email link is clicked, this function searches for token to see if it exists and is still valid.
//It will clear expired tokens
//It then displays the reset password page
router.get("/user/reset-password", async function (req, res, next) {
  const email = req.query.email;
  const passworkToken = req.query.token;

  //Function to remove expired tokens when email link clicked
  await userDao.removeExpiredTokens();

  // //Function to find the token. If it does not exist, redirect to login page. 
  const record = await userDao.retrieveValidTokens(email, passworkToken);
  if (record == null) {
    res.locals.message = "Password reset link has expired."
    res.render("passwordReset");
  } else {
    res.locals.userEmail = email;
    res.render("newPasswordForm");
  }
});

//Handler for password reset form.
router.post("/reset-password", async function (req, res) {
  const password = req.body.newPassword;

  const hash = await bcrypt.hash(password, 12);
  const email = req.body.email;

  try {
    await userDao.updatePasswordByEmail(email, hash);
    res.setToastMessage("Password successfully updated!");
    res.redirect("/login");
  } catch (err) {
    res.setToastMessage(`An error has occurred => ${err}`);
    res.redirect("/login");
  }
});

module.exports = router;
