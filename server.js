const inquirer = require("inquirer");
const chalk = require("chalk");
const mysql = require("mysql");

//RDMS means Relation DataBase Management System
//Below is the wrapper class for my sql client. 
//The constructor simply creates a new MySQL connection with the given configuration.
//The connection is automatically open when the first query is executed
class RDBMS {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  //query() method takes an SQL string and an optional array of parameters that will be passed to the query. 
  //promise will be “resolved” when the query finished executing. 
  //promise will be “rejected” if there is an error. 
  //Link to the documentation from where i learned that => https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
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

 
