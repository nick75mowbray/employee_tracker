# employee_tracker

![screen shot of desktop](/assets/application.png)
## Description
This application is an employee tracker that uses mysql to modify data on the database and takes input through the command line using inquirer.
![demo](/assets/employee_tracker_demo.gif)   
[link to video on google drive](https://drive.google.com/file/d/1ioD-uYxyJ-ygDRjrVnzFTbJXEzaAtGu6/view)   
[link to YouTube demonstration](https://youtu.be/lCweCd8Wrg8)

## Table of Contents
* [Description](#Description)
* [Installation](#Installation)
* [Features](#Features)
* [Questions](#Questions)
## Installation
```
npm install
npm install mysql
npm install console.table
npm install inquirer

```
run schema.sql in your database application
(optional) run seed.sql to populate database

change connection properties in index.js line 7
```
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "", // your username
    password: "", // your password
    database: "employee_tracker"
  });
```
run in the command line:
``` 
node index.js
```
## Features
This application allows the user to interact with a database using the command line.  
The user can:  
-view employees, roles, departments   
-edit employees, roles, departments   
-add employees, roles, departments  
-delete employees, roles, departments  
-view total budget (combined salaries of all employees)

When viewing employees the user has the option to view all employees ordered by the employees manager.  
When editing employees the user can add roles and managers by simply selecting from a list of options rather than having to enter an id.  
When editing roles the user can add department from a list of options displaying the department title. 
To view the total budget the program uses an INNER JOIN and SUM to retrieve the data.

The code in this application is quite long and I tried to separate it into multiple js files with a few functions in each but this caused errors most likely due to the number of nested functions and the fact that the program will keep running until it is stopped always returning to the start menu after each action.

## Questions
[github](https://github.com/nick75mowbray)
