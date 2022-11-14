async function example1 () {
    const mysql = require('mysql2/promise');
    const connect = await mysql.createConnection({ 
      host:"localhost",
      user:"root",
      password:"",
      database:"transactions"
    });
    return connect ;
}
module.exports=example1;


