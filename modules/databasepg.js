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

// client.query(`SELECT * FROM users`, (err, res) =>{
//     if(!err){
//         console.log(res.rows);
//     }else{
//         console.log(err)
//     }
//     client.end;
// })

module.exports = client;