const inquirer = require("inquirer");
const chalk = require("chalk");
const mysql = require("mysql");
const figlet = require('figlet');

/* RDMS means Relation DataBase Management System
   Below is the wrapper class for my sql client. 
   The constructor simply creates a new MySQL connection with the given configuration.
   The connection is automatically open when the first query is executed
*/
class RDBMS {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  /* query() method takes an SQL string and an optional array of parameters that will be passed to the query. 
     promise will be “resolved” when the query finished executing. 
     promise will be “rejected” if there is an error. 
     Link to the documentation from where i learned that => https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
  */
  query( sql, params ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, params, ( err, data ) => {
              if ( err ) {
                  console.log(err.sql);
                  console.log("");
                  return reject( err );
              }
              resolve( data );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}


const conn = new RDBMS({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sqlroot321",
  database: "emp_manage_sysDB"
});

 
/*
  Start of calls to the RDBMS 
*/
async function getManagerNames() {
  let query = "SELECT * FROM employee WHERE manager_id IS NULL";

  const empTable = await conn.query(query);
  let employeeName = [];
  for(const employee of empTable) {
      employeeName.push(employee.first_name + " " + employee.last_name);
  }
  return employeeName;
}

async function getRoles() {
  let query = "SELECT title FROM role";
  const roleTable = await conn.query(query);
  //console.log("Number of rows returned: " + rows.length);

  let roleNames = [];
  for(const role of roleTable) {
      roleNames.push(role.title);
  }

  return roleNames;
}

async function getDepartmentNames() {
  let query = "SELECT name FROM department";
  const deptTable = await conn.query(query);

  let deptNames = [];
  for(const department of deptTable) {
      deptNames.push(department.name);
  }

  return deptNames;
}

async function getDepartmentId(departmentName) {
  let query = "SELECT * FROM department WHERE department.name=?";
  let params = [departmentName];
  const data = await conn.query(query, params);
  return data[0].id;
}

// Given the name of the role, what is its id?
async function getRoleId(roleName) {
  let query = "SELECT * FROM role WHERE role.title=?";
  let params = [roleName];
  const data = await conn.query(query, params);
  return data[0].id;
}
