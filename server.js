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

  //Creating our Application logo below
  console.log(
    chalk.bgBlackBright(
      figlet.textSync('EM System', { horizontalLayout: 'full' })
    )
  );

  //main prompt for the user to interact with the application
  async function mainPrompt() {
    return inquirer
        .prompt ([
            {
                type: "list",
                message: "Employee Management System",
                name: "action",
                choices: [
                  "Choose to Add department",
                  "Choose to Add employee",
                  "Choose to Add role",
                  "Choose to Remove employee record",
                  "Choose to Update employee role",
                  "View all departments Info",
                  "View all employees Info",
                  "View all employees by department",
                  "View all roles data",
                  "View all managers",
                  "View all Department Job Titles with salaries",
                  "View all employee with salaries",
                  "Exit"
                ]
            }
        ])
  }

  //Calling our main asynch function based on user selected answer
  main();
  async function main() {
    let exitLoop = false;
    while(!exitLoop) {
        const prompt = await mainPrompt();
  
        switch(prompt.action) {
            case 'Choose to Add department': {
              console.log(
                chalk.yellow(
                  figlet.textSync('New Dept Data', { font:'small', horizontalLayout: 'full' })
                )
              );
                const newDepartmentName = await getDepartmentInfo();
                await addDepartment(newDepartmentName);
                break;
            }
  
            case 'Choose to Add employee': {
              console.log(
                chalk.blueBright(
                  figlet.textSync('Add Employee', { font:'small', horizontalLayout: 'full' })
                )
              );
                const newEmployee = await getAddEmployeeInfo();
                console.log("add an employee");
                console.log(newEmployee);
                await addEmployee(newEmployee);
                break;
            }
  
            case 'Choose to Add role': {
              console.log(
                chalk.greenBright(
                  figlet.textSync('Adding Role', { font:'small', horizontalLayout: 'full' })
                )
              );
                const newRole = await getRoleInfo();
                console.log("add a role");
                await addRole(newRole);
                break;
            }
  
            case 'Choose to Remove employee record': {
              console.log(
                chalk.red(
                  figlet.textSync('Removing Data', { font:'small', horizontalLayout: 'full' })
                )
              );
                const employee = await getRemoveEmployeeInfo();
                await removeEmployee(employee);
                break;
            }
            
            case 'Choose to Update employee role': {
              console.log(
                chalk.red(
                  figlet.textSync('Update role', { font:'small', horizontalLayout: 'full' })
                )
              );
                const employee = await getUpdateEmployeeRoleInfo();
                await updateEmployeeRole(employee);
                break;
            }
  
            case 'View all departments Info': {
              console.log(
                chalk.redBright(
                  figlet.textSync('Departments', { font:'small', horizontalLayout: 'full' })
                )
              );
                await viewAllDepartments();
                break;
            }
  
            case 'View all employees Info': {
              console.log(
                chalk.blueBright(
                  figlet.textSync('Employees', { font:'small', horizontalLayout: 'full' })
                )
              );
                await viewAllEmployees();
                break;
            }
  
            case 'View all employees by department': {
                await viewAllEmployeesByDepartment();
                break;
            }
  
            case 'View all roles data': {
              console.log(
                chalk.yellowBright(
                  figlet.textSync('Roles', { font:'small', horizontalLayout: 'full' })
                )
              );
                await viewAllRoles();
                break;
            }

            case 'View all managers': {
              console.log(
                chalk.greenBright(
                  figlet.textSync('Managers', { font:'small', horizontalLayout: 'full' })
                )
              );
              await viewAllManagers();
              break;
          }

          case 'View all Department Job Titles with salaries': {
            await viewDepartmentBySalary();
            break;
        }

        case 'View all employee with salaries': {
          console.log(
            chalk.greenBright(
              figlet.textSync('Employees with Salaries', { font:'small', horizontalLayout: 'full' })
            )
          );
          await viewAllEmployeeBySalaries();
          break;
      }
  
            case 'Exit': {
                process.exit(0);
            }
        }
    }
  }

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

  /* Asynchronous fuunction that will display all the managers names */
  async function viewAllManagers() {
    console.log("");
    let query = "SELECT * FROM employee where manager_id IS NULL";
    const data = await conn.query(query);
    console.table(data);
    return data;
  }

  /* Asynchronous fuunction that will display all the employee and their salaries */
  async function viewAllEmployeeBySalaries() {
    console.log("");
    let query = "select first_name, last_name, salary from employee, role where employee.role_id = role.id";
    const data = await conn.query(query);
    console.table(data);
    return data;
  }

  /* Asynchronous fuunction that will display each department with positions with respect to there salary */
  async function viewDepartmentBySalary() {
    console.log("");
    let query = "select name as department, title,salary from department,role where department.id=department_id";
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

async function getAddEmployeeInfo() {
  const managers = await getManagerNames();
  const roles = await getRoles();
  return inquirer
      .prompt([
          {
              type: "input",
              name: "first_name",
              message: "What is the employee's first name?"
          },
          {
              type: "input",
              name: "last_name",
              message: "What is the employee's last name?"
          },
          {
              type: "list",
              message: "What is the employee's role?",
              name: "role",
              choices: [
                  // populate from RDBMS
                  ...roles
              ]
          },
          {
              type: "list",
              message: "Who is the employee's manager?",
              name: "manager",
              choices: [
                  // populate from RDBMS
                  ...managers
              ]
          }
      ])
}

async function getRemoveEmployeeInfo() {
  const employees = await getEmployeeNames();
  return inquirer
  .prompt([
      {
          type: "list",
          message: "Which employee do you want to remove?",
          name: "employeeName",
          choices: [
              // populate from RDBMS
              ...employees
          ]
      }
  ])
}

async function getDepartmentInfo() {
  return inquirer
  .prompt([
      {
          type: "input",
          message: "What is the name of the new department?",
          name: "departmentName"
      }
  ])
}

async function getRoleInfo() {
  const departments = await getDepartmentNames();
  return inquirer
  .prompt([
      {
          type: "input",
          message: "What is the title of the new role?",
          name: "roleName"
      },
      {
          type: "input",
          message: "What is the salary of the new role?",
          name: "salary"
      },
      {
          type: "list",
          message: "Which department uses this role?",
          name: "departmentName",
          choices: [
              // populate from RDBMS
              ...departments
          ]
      }
  ])
}

async function getUpdateEmployeeRoleInfo() {
  const employees = await getEmployeeNames();
  const roles = await getRoles();
  return inquirer
      .prompt([
          {
              type: "list",
              message: "Which employee do you want to update?",
              name: "employeeName",
              choices: [
                  // populate from RDBMS
                  ...employees
              ]
          },
          {
              type: "list",
              message: "What is the employee's new role?",
              name: "role",
              choices: [
                  // populate from RDBMS
                  ...roles
              ]
          }
      ])

}


// Close your database connection when Node exits
process.on("exit", async function(code) {
  await db.close();
  return console.log(`About to exit with code ${code}`);
});








