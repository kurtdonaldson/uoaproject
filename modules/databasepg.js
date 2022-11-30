// const dotenv = require("dotenv");
// dotenv.config({path: "../.env"});

// const {Client} = require('pg');


// const conectionString='postgres://blog_database_lu9i_user:5bDVJiJYtxpEzkEfQXsTZQKfMj3bctib@dpg-ce37supa6gdlrbdesmp0-a.oregon-postgres.render.com/blog_database_lu9i?ssl=true'
// const client = new Client({
//     connectionString: conectionString
//     })

// client.connect();

// module.exports = client;

// EMAIL_USERNAME=iguanas22@zohomail.com
// EMAIL_PASSWORD=tDBJzqJ3MqbT
// DOMAIN=localhost:3000
// POSTGRES_PASSWORD=Auckland7
// PORT = 
// PGUSER=blog_database_lu9i_user
// PGHOST=postgres://blog_database_lu9i_user:5bDVJiJYtxpEzkEfQXsTZQKfMj3bctib@dpg-ce37supa6gdlrbdesmp0-a.oregon-postgres.render.com/blog_database_lu9i
// PGPASSWORD=5bDVJiJYtxpEzkEfQXsTZQKfMj3bctib
// PGDATABASE=blog_database_lu9i
// PGPORT=5432
// DATABASE_URL=postgres://blog_database_lu9i_user:5bDVJiJYtxpEzkEfQXsTZQKfMj3bctib@dpg-ce37supa6gdlrbdesmp0-a/blog_database_lu9i
// NODE_ENV=production

const dotenv = require("dotenv");
dotenv.config({path: "../.env"});


const {Client} = require('pg');


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: 'Auckland7',
    database: "blog-project"
})

client.connect();

module.exports = client;

//Note! Had to add ssl = true