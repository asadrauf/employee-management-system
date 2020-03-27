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

/*Asynchronous function that will give us the list of managers each time we add an employee so we can 
  an manager to every new employee that we are pushing into an return array*/
    async function getManagerNames() {
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";
    const empTable = await conn.query(query);
    let employeeName = [];
    for(const employee of empTable) {
        employeeName.push(employee.first_name + " " + employee.last_name);
    }
    return employeeName;
  }

  /* Asynchronous function to get the possible roles exists in our database 
     that we are pushing into roleNames return Array */
    async function getRoles() {
    let query = "SELECT title FROM role";
    const roleTable = await conn.query(query);
    let roleNames = [];
    for(const role of roleTable) {
        roleNames.push(role.title);
    }
    return roleNames;
  }

   /* Asynchronous function to get the departments name exists in our database 
     that we are pushing into deptNames return Array */
    async function getDepartmentNames() {
    let query = "SELECT name FROM department";
    const deptTable = await conn.query(query);
    let deptNames = [];
    for(const department of deptTable) {
        deptNames.push(department.name);
    }
    return deptNames;
  }

   /* Asynchronous function which include where clause to get the desired 
   department data */
    async function getDepartmentId(departmentName) {
    let query = "SELECT * FROM department WHERE department.name=?";
    let params = [departmentName];
    const data = await conn.query(query, params);
    return data[0].id;
  }

    /* Asynchronous function which include where clause to get the desired 
   role.title data data */
    async function getRoleId(roleName) {
    let query = "SELECT * FROM role WHERE role.title=?";
    let params = [roleName];
    const data = await conn.query(query, params);
    return data[0].id;
  }

   // need to find the employee.id of the named manager
    async function getEmployeeId(fullName) {
    // First split the name into first name and last name
    let employee = getFirstAndLastName(fullName);
    let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
    let params=[employee[0], employee[1]];
    const data = await conn.query(query, params);
    return data[0].id;
  }

  /* Asynchronous function which will return an array  that will hold
     emp first name and last name */
    async function getEmployeeNames() {
    let query = "SELECT * FROM employee";
    const emp = await conn.query(query);
    let employeeNames = [];
    for(const employee of emp) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
  }

  /* Asynchronous function to view all the possible roles
     that exist in our database */
    async function viewAllRoles() {
    console.log("");
    let query = "SELECT * FROM role";
    const data = await conn.query(query);
    console.table(data);
    return data;
  }

  /* Asynchronous function to view all the possible departments
     that exist in our database */
    async function viewAllDepartments() {
    let query = "SELECT * FROM department";
    const data = await conn.query(query);
    console.table(data);
  }

   /* Asynchronous function to view all the existing employees
      that exist in our database */
    async function viewAllEmployees() {
    console.log("");
    let query = "SELECT * FROM employee";
    const data = await conn.query(query);
    console.table(data);
  }

   /* Asynchronous function which contains a JOIN query that will display employee data 
      vs current department  */
    async function viewAllEmployeesByDepartment() {
    let query = "SELECT first_name as FirstName, last_name as LastName, department.name as Department FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
    const data = await conn.query(query);
    console.table(data);
  }

   /* Asynchronous helper function each time we want to update the record
      this will get us emp list with first and last name  */
    function getFirstAndLastName( fullName ) {
    let employee = fullName.split(" ");
    if(employee.length == 2) {
        return employee;
    }

    const last_name = employee[employee.length-1];
    let first_name = " ";
    for(let i=0; i<employee.length-1; i++) {
        first_name = first_name + employee[i] + " ";
    }
    return [first_name.trim(), last_name];
  }

  /* Asynchronous function in order to update employee role
     we need employee id and employee full name so we can pass that into params */
    async function updateEmployeeRole(employeeInfo) {
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);
    let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
    let params=[roleId, employee[0], employee[1]];
    const rows = await conn.query(query, params);
    console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
  }

  /*Asynchronous function in order to add employee we will get 
    emp data like naame , manager name etc to insert into database */
    async function addEmployee(employeeInfo) {
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmployeeId(employeeInfo.manager);
    let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    let params = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
    const rows = await conn.query(query, params);
    console.log(chalk.greenBright(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`));
  }

  /*Asynchronous function deleting employee from database where
  input first and last name matched with database entry*/
    async function removeEmployee(employeeInfo) {
    const employeeName = getFirstAndLastName(employeeInfo.employeeName);
    let query = "DELETE from employee WHERE first_name=? AND last_name=?";
    let params = [employeeName[0], employeeName[1]];
    const rows = await conn.query(query, params);
    console.log(chalk.redBright(`Employee removed: ${employeeName[0]} ${employeeName[1]}`));
  }

  /* Asynchronous function to add a new department in our
  department table */
    async function addDepartment(departmentInfo) {
    const departmentName = departmentInfo.departmentName;
    let query = 'INSERT into department (name) VALUES (?)';
    let params = [departmentName];
    const rows = await conn.query(query, params);
    console.log(chalk.yellow(`Added department named ${departmentName}`));
  }

   /* Asynchronous function to add a new role in our
  role table */
    async function addRole(roleInfo) {
    const departmentId = await getDepartmentId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
    let params = [title, salary, departmentId];
    const rows = await conn.query(query, params);
    console.log(chalk.greenBright(`Added role ${title}`));
  }

/* 
Done here integrating with the mysql database
*/
