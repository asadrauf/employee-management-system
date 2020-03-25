const inquirer = require("inquirer");
let cTable = require("console.table");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "sqlroot321",
    database: "emp_manage_sysDB"
  });
  connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log(`connected as id ${connection.threadId}`);
    mainPrompt();
  });
  
