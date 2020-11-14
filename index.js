// import components
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const employee = require("./employeeFunctions.js");
const genericFunc = require("./genericFunctions.js");
const role = require("./roleFunctions.js");

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
      default:
        break;
    }
  })
}

// add department
function addDepartment(){
  console.log(`\n`);
  inquirer.prompt([
    {
    name: "name",
    message: "department name: ",
    type: "input"
  },
]).then(function(answers){
  console.log(`Adding ${answers.name} to database...\n`);
    var query = connection.query(
      "INSERT INTO department SET ?",
      {department_name: answers.name},
      function(err, res) {
        if (err) throw err;
        // console.log(res.affectedRows + " department added successfully!\n");
      }
    );
    // logs the actual query being run
    console.log(query.sql);
    // return to menu
    runEmployeeTracker();
  })
};

// add role
function addRole(){
  // read departments in database
  getDepartments();
  // ask questions
  addRoleQuestions();
}
// function for add roles questions
function addRoleQuestions(){
  console.log(`departements array: ${departmentsArr}`);
  // put department names in array for display
  let departmentChoices = [];
  for (let i = 0; i < departmentsArr.length; i++){
    departmentChoices.push(departmentsArr[i].department_name);
  }
  console.log(`\n`);

  inquirer.prompt([
    {
    name: "title",
    message: "role title: ",
    type: "input"
  },{
    name: "salary",
    message: "role salary: ",
    type: "number",
  },{
    name: "department",
    message: "department: ",
    type: "list",
    // display departments retrieved from db
    choices: departmentChoices
  }
]).then(function(answers){
  console.log(`Adding ${answers.title} to database...\n`);
  // get id of selected dapartment
  let departmentID = 0;
  for (let i = 0; i < departmentsArr.length; i++){
    if (answers.department==departmentArr[i].department_name){
      departmentID = departmentArr[i].id;
    }
  }
    var query = connection.query(
      "INSERT INTO department SET ?",
      {title: answers.title,
      salary: answers.salary,
      department_id: departmentID},
      function(err, res) {
        if (err) throw err;
        // console.log(res.affectedRows + " department added successfully!\n");
      }
    );
    // logs the actual query being run
    console.log(query.sql);
    // return to menu
    runEmployeeTracker();
  })
};

// function to retrieve departments from db
function getDepartments(){
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    departmentsArr = res;
      console.log(`departments in db: ${departmentsArr}`);
      connection.end();
      return departmentsArr;
  });

};

function mysqlInsert(table_name, data_object){
  var query = connection.query(
      `INSERT INTO ${table_name} SET ?`,
      data_object,
      function(err, res) {
        if (err) throw err;
        console.log(`\nsuccessfully added into ${table_name}\n`);
      }
    );
    // logs the actual query being run
    console.log(query.sql);    
};


