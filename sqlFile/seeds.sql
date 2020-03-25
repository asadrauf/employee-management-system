
--below we are inerting data into our department table
insert into department (name) 
values ("Sales");
insert into department (name) 
values ("IT");
insert into department (name) 
values ("Production");
insert into department (name) 
values ("HR");

--below we are inserting data into our role table
insert into role (title, salary, department_id) 
values ("Sales Manager", 200000, 1);
insert into role (title, salary, department_id) 
values ("Sales person", 50000, 1);
insert into role (title, salary, department_id) 
values ("IT Manager", 200000, 2);
insert into role (title, salary, department_id) 
values ("Engineer", 900000, 2);
insert into role (title, salary, department_id) 
values ("Production Manager", 200000, 3);
insert into role (title, salary, department_id) 
values ("Metrology Tech", 40000, 3);
insert into role (title, salary, department_id) 
values ("Process Tech", 40000, 3);
insert into role (title, salary, department_id) 
values ("Counselor", 60000, 4);

--below we are inserting data into our employee table
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Alper.", "G", 1, null);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Asad", "Rauf", 2, 1);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Andrew", "Hall", 2, 1);

insert into employee (first_name, last_name, role_id, manager_id) 
values ("Conner", "L", 3, null);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Asma", "Cool", 4, 3);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Michael", "Mccready", 4, 3);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Mike", "Nance", 4, 3);

insert into employee (first_name, last_name, role_id, manager_id) 
values ("Tim", "A", 5, null);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Yemane", "Abreha", 6, 5);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Bellete", "Dress", 7, 5);
insert into employee (first_name, last_name, role_id, manager_id) 
values ("Melissa", "Sperry", 7, 5);

insert into employee (first_name, last_name, role_id, manager_id) 
values ("Shakira", "Smith", 9, null);
