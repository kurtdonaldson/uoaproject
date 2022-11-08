// Setup Express
const express = require("express");
const app = express();
const port = 3000;
const methodOverride = require("method-override");

//Using method override to allow use of put request on client side. Client side only accepts get or post requests
app.use(methodOverride("_method"));

//We installed body parser and ran bodyParser.json to allow us to read the deleteId being sent from the front end.
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.urlencoded({ extended: false }));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup our middleware
app.use(require("./middleware/toaster-middleware.js"));
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

// Setup our routes
const authRouter = require("./routes/auth-routes.js");
app.use(authRouter);

const appRouter = require("./routes/application-routes.js");
app.use(appRouter);

const passwordResetRouter = require("./routes/password-reset-routes");
app.use(passwordResetRouter);

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
