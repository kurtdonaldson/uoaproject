# Final project &ndash; A personal blogging system &ndash; Starter project

This repository contains a starting point for your team's final project.

Your team should update this README to include the information required, as presented in the project handout available on Canvas.

Introduction
  - Our webapp was designed to allow a user to view, add, edit and delete a blog post. There is registration and login functionality
  which allows a user to create their own account and then add, delete and edit their own blog posts. They are also able to edit their
  account information. Users are able to view all the blog posts, even if they do not have an account. 

Compulsory features implemented
1. Users are able to create new accounts. 
2. When selecting a username while creating an account, users are immediately informed if the given username is already taken. If taken, the submit button is disabled. 
3. When selecting a password while creating an account, user must re-enter the same password, otherwise, submit button disabled. 
4. When creating an account, users are able to choose from amongst a set of predefined “avatar” icons to represent themselves.
5. Once a user has created an account, they are able to log in and log out.
6. Passwords are hashed and salted and prior to being stored in the database. This was implemented using the npm package bcrypt. 
7. Users are able to browse a list of all articles, regardless of whether they are logged in or not. If logged in, they are able to browse a
list of their own articles.
8. When logged in, users are able to add new articles, and edit or delete existing articles which they have authored.
9. The tinyMCE text editor with WYSIWYG (What You See Is What You Get) functionality support was implemented. Images are able to
be placed within articles at any point, and are stored as files on the server. 
10. Web application is responsive.
11. User is able to edit or delete any of their account information and delete their account. 

Extra features implemented
1. Password reset functionality. Users are able to enter their email and receive a password reset link which allows them to reset their password. 
The password link expires after 60 minutes. 

2. Import multiple blog content via excel spreadsheet. Users are able to upload multiple blogs via the template (excel spreadsheet) provided. The uploaded spreadsheet will be deleted after the data is written to the database.

3. Live search function. User is able to search through all the articles title, author and content. Results are displayed as the user is typing. 

4. Light/dark mode. User is able to toggle between light and dark theme.

Instructions for use

1. npm install
1a. If uploads folder not created, add uploads folder under public
2. Open SQLite and create a database called blog-database.db in the project folder.
3. Open and run blog-database.sql in the blog-database.db database. This file is located in the sql folder within the project folder.
4. Write changes.
5. Add .env file in project foler. Add the following to the .env file. 
EMAIL_USERNAME=iguanas22@zohomail.com
EMAIL_PASSWORD=tDBJzqJ3MqbT
DOMAIN=localhost:3000
6. npm start to start server
7. Dummy login details. 
    Username: Polly 
    Password: 123
8. To use the password reset function, you will need to create an account with an email you can access. 


# uoaproject

Issues
 1. The primary key sequence was not working with users id. When creating a new client, the id would not increment from the last user. It would start at 1. 
 This worked fine for the blog table. After research, I realised that my user table had become out of sync. Likely due to the mass import of data to initialise the table. 
 I added a simple SELECT co
