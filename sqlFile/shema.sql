DROP DATABASE IF EXISTS emp_manage_sysDB;
--creating our database
CREATE database emp_manage_sysDB;

USE emp_manage_sysDB;

--creating our dep table
CREATE TABLE department (
  id INTEGER NOT NULL auto_increment,
  name VARCHAR(30),
  PRIMARY KEY(id)
);

--creating our role table with primary key id and foreign key dep id
CREATE TABLE role (
  id INTEGER NOT NULL auto_increment,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER,
  PRIMARY KEY(id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

--creating our emp table with primary key id and foreign key role id & manager role id so we can assign each emp a manager related to dep
CREATE TABLE employee (
  id INTEGER NOT NULL auto_increment,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES role(id)
);

