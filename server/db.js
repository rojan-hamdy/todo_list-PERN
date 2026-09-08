const {Pool} = require("pg");
const pool = new Pool({
    user: "todouser",
    password: 'myPass123!',
    host: "localhost",
    port: 5432,
    database: "todo_list"
})
module.exports = pool;