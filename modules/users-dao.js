// const SQL = require("sql-template-strings");
// const dbPromise = require("./database.js");

// /**
//  * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
//  * to the user.
//  *
//  */
// async function createUser(user) {
//   const db = await dbPromise;

//   const result = await db.run(SQL`
//         insert into users (username, password, name, email, dob, description, avatarIconUrl) 
//         values(${user.username}, ${user.password}, ${user.name}, ${user.email}, ${user.dob}, ${user.description}, ${user.avatarIconUrl})`);

//   // Get the auto-generated ID value, and assign it back to the user object.
//   user.id = result.lastID;
// }

// /**
//  * Gets the user with the given id from the database.
//  * If there is no such user, undefined will be returned.
//  *
//  */
// async function retrieveUserById(id) {
//   const db = await dbPromise;

//   const user = await db.get(SQL`
//         select * from users
//         where id = ${id}`);

//   return user;
// }

// //Retrieve user id when given username.
// async function retrieveUserIdByUsername(username) {
//   const db = await dbPromise;

//   const userId = await db.get(SQL`
//         select id from users
//         where username = ${username}`);

//   return userId;
// }

// //Retrieve user by email
// async function retrieveUserByEmail(email) {
//   const db = await dbPromise;

//   const user = await db.get(SQL`
//         select * from users
//         where email = ${email}`);

//   return user;
// }

// //Update passwordtoken used status by email
// async function updatePasswordResetUsedByEmail(email) {
//   const db = await dbPromise;

//   const user = await db.get(SQL`
//         update users
//         set used = 1
//         where email = ${email};`);
// }

// //Update password reset token for user
// async function insertResetTokenByEmail(email, passwordToken) {
//   const db = await dbPromise;

//   const insertResetToken = await db.run(SQL`
//         update users
//         set passwordToken = ${passwordToken}, createdAt = datetime(), expiration = datetime(datetime(), '+60 minutes'), used = 0
//         where email = ${email};`);
// }

// //Removes expired password tokens
// async function removeExpiredTokens() {
//   const db = await dbPromise;

//   await db.run(SQL`
//       update users
//       set passwordToken = null, expiration = null, createdAt = null
//       where expiration < datetime();`);
// }

// async function retrieveValidTokens(email, token) {
//   const db = await dbPromise;

//   const userPasswordToken = await db.get(SQL`
//       select *
//       from users
//       where email = ${email}
//       and expiration > datetime()
//       and passwordToken = ${token}
//       and used = '0';`);

//   return userPasswordToken;
// }

// /**
//  * Gets the user with the given username and password from the database.
//  * If there is no such user, undefined will be returned.
//  *
//  */
// async function retrieveUserWithCredentials(username, password) {
//   const db = await dbPromise;

//   const user = await db.get(SQL`
//         select * from users
//         where username = ${username} and password = ${password}`);

//   return user;
// }

// /**
//  * Gets the user with the given authToken from the database.
//  * If there is no such user, undefined will be returned.
//  *
//  */
// async function retrieveUserWithAuthToken(authToken) {
//   const db = await dbPromise;

//   const user = await db.get(SQL`
//         select * from users
//         where authToken = ${authToken}`);

//   return user;
// }

// // Retrieves a single user from the database
// async function retrieveUserByUsername(username) {
//   const db = await dbPromise;

//   const user = await db.get(SQL`
//         select * from users
//         where username = ${username}`);

//   return user;
// }

// /**
//  * Gets an array of all users from the database.
//  */
// async function retrieveAllUsers() {
//   const db = await dbPromise;

//   const users = await db.all(SQL`select * from users`);

//   return users;
// }

// // Get an array of all the users avatar Urls
// async function retrieveAllAvatarIconUrls() {
//   const db = await dbPromise;

//   const avatarUrls = await db.all(SQL`select avatarIconUrl, id
//   from users;`);

//   return avatarUrls;
// }

// /**
//  * Updates the given user in the database, not including auth token
//  *
//  */
// async function updateUser(user) {
//   const db = await dbPromise;

//   await db.run(SQL`
//         update users
//         set username = ${user.username}, password = ${user.password},
//             name = ${user.name}, authToken = ${user.authToken}
//         where id = ${user.id}`);
// }

// //Updates users information
// async function updateUserAccount(user) {
//   const db = await dbPromise;

//   await db.run(SQL`
//         update users
//         set username = ${user.username}, password = ${user.password},
//             name = ${user.name}, email = ${user.email}, dob = ${user.dob}, description = ${user.description}, avatarIconUrl = ${user.avatarIconUrl}
//         where id = ${user.userId}`);
// }

// //Update password through password reset link
// async function updatePasswordByEmail(email, password) {
//   const db = await dbPromise;

//   await db.run(SQL`
//       update users
//       set password = ${password}
//       where email = ${email};`);
// }

// /**
//  * Deletes the user with the given id from the database.
//  *
//  */
// async function deleteUser(id) {
//   const db = await dbPromise;

//   await db.run(SQL`
//         delete from users
//         where id = ${id}`);

//         await db.run(SQL`
//         delete from blog
//         where authorId = ${id}`);
// }

// // Export functions.
// module.exports = {
//   createUser,
//   retrieveUserById,
//   retrieveUserWithCredentials,
//   retrieveUserWithAuthToken,
//   retrieveAllUsers,
//   updateUser,
//   deleteUser,
//   retrieveUserIdByUsername,
//   retrieveAllAvatarIconUrls,
//   retrieveUserByUsername,
//   updateUserAccount,
//   retrieveUserByEmail,
//   updatePasswordResetUsedByEmail,
//   insertResetTokenByEmail,
//   removeExpiredTokens,
//   retrieveValidTokens,
//   updatePasswordByEmail,
// };