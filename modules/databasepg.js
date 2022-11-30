const dotenv = require("dotenv");
dotenv.config();

const {Client} = require('pg');


const conectionString='postgres://blog_database_lu9i_user:5bDVJiJYtxpEzkEfQXsTZQKfMj3bctib@dpg-ce37supa6gdlrbdesmp0-a.oregon-postgres.render.com/blog_database_lu9i?ssl=true';
const client = new Client({
    connectionString: conectionString
    })

client.connect();

module.exports = client;


// const dotenv = require("dotenv");
// dotenv.config({path: "../.env"});


// const {Client} = require('pg');


// const client = new Client({
//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password: 'Auckland7',
//     database: "blog-project"
// })

// client.connect();

// module.exports = client;

//Note! Had to add ssl = true