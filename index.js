// import components
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

// mysql connection ------
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
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
        viewEmployees();
        break;
      default:
        break;
    }
  })
}

// function view employees
function viewEmployees(){
  inquirer.prompt({
    name: "sortby",
    message: "\nview employees by:\n",
    type: "list",
    choices: [
      "view all employees",
      "view employees by manager"]
  }).then(function(answers){
    if (answers.sortby==="view all employees"){
      viewAllEmployees();
    } else {
      viewEmployeesByManager();
    }
  });
}

// function to view all employees
function viewAllEmployees(){
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement using console.table
    let employeetable = [];
    
    for (let i = 0; i < res.length; i++){
      let tableRow = {};
      tableRow.id = res[i].id;
      tableRow.name = (res[i].first_name)+" "+(res[i].last_name);
      employeetable.push(tableRow);
    }
    const table = cTable.getTable(employeetable);
    // console.log(`res from view all employees ${employeetable}`);
    console.log(table);
  });
};

// function to view employees by manager
function viewEmployeesByManager(){
  connection.query("SELECT * FROM manager", function(err, res) {
    if (err) throw err;
    inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push((res[i].manager_first_name)+" "+(res[i].manager_last_name));
          }
          return choiceArray;
        },
        message: "\nManagers: "
      }
    ])
    .then(function(answer) {
      // get the information of the chosen item
      var chosenManager;
      for (var i = 0; i < res.length; i++) {
        if ((res[i].manager_first_name+" "+res[i].manager_last_name) === answer.choice) {
          chosenManager = res[i];
        }
      }
      connection.query(`SELECT * FROM employee WHERE manager_id=?`, ""+chosenManager.id+"", 
      function(err, res) {
        if (err) throw err;
        let tableData = [];
        let tableRow = {};
        for (let i = 0; i < res.length; i++){
          tableRow.id = res[i].id;
          tableRow.name = (res[i].first_name+" "+res[i].last_name);
          tableData.push(tableRow);
        }
        const table = cTable.getTable(tableData);
    // console.log(`res from view all employees ${employeetable}`);
    console.log("\n"+table);
      });
  });
});
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

function mysqlDelete(table_name, condition, data){
  var query = connection.query(
      `DELETE FROM ${table_name} WHERE ${condition}=?`,
      data,
      function(err, res) {
        if (err) throw err;
        console.log(`\n${data} deleted from ${table_name}\n`);
      }
    );
    // logs the actual query being run
    console.log(query.sql);    
};
