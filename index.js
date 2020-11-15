// import components
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const employee = require("./employeeFunctions.js");
const genericFunc = require("./genericFunctions.js");
const role = require("./roleFunctions.js");
const department = require("./departmentFunctions.js");

// mysql connection ------
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Mylocalhost34",
    database: "employee_tracker"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // run program
    runEmployeeTracker();
});

// main menu function
function runEmployeeTracker(){
  console.log(`\n`);
  inquirer.prompt({
    name: "menu",
    message: "Welcome to Employee Tracker\n",
    type: "list",
    pageSize: 25,
    choices: [
      new inquirer.Separator("-----Employees-----"),
      "view employees", 
      "edit employees",
      "add employees",
      "delete employees",
      new inquirer.Separator("\n-------Roles-------"),
      "view roles", 
      "edit roles",
      "add roles",
      "delete roles",
      new inquirer.Separator("\n----Departments----"),
      "view departments", 
      "edit departments",
      "add departments",
      "delete departments",
      new inquirer.Separator("\n-------Budget-------"),
      "view budget"]
  }).then(function(answers){
    switch (answers.menu){
      case "view employees":
        employee.view();
        break;
      case "edit employees":
        employee.edit();
        break;
      case "add employees":
        employee.add();
        break;
      case "delete employees":
        employee.delete();
        break;
      case "view roles":
        genericFunc.viewDB("role");
        break;
      case "edit roles":
        role.edit();
        break;
      case "add roles":
        role.add();
        break;
      case "delete roles":
        role.delete();
        break;
      case "view departments":
        genericFunc.viewDB("department");
        break;
      case "edit departments":
        department.edit();
        break;
      case "add departments":
        department.add();
        break;
      case "delete departments":
        department.delete();
        break;
      case "view budget":
        viewBudget();
        break;
      default:
        break;
    }
  })
}

// view budget
function viewBudget(){
  // connection.query("SELECT")
}


