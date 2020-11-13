// import components
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

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
        viewEmployees();
        break;
      case "edit employees":
        editEmployees();
        break;
      default:
        break;
    }
  })
}
// generic functions
function viewDB(table_name, orderBy = "id", message = ""){
  connection.query(`SELECT * FROM ${table_name} ORDER BY ${orderBy}`, function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement using console.table
    outputTable(res, message);
  });
};
// function to turn results into a table
function outputTable(results, message){
  console.log(`\n${message}`);
  let mytable = [];
    for (let i = 0; i < results.length; i++){
      let tableRow = {};
      tableRow = results[i];
      mytable.push(tableRow);
    }
    const table = cTable.getTable(mytable);
    console.log(`\n${table}`);
};
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
      viewDB("employee");
    } else {
      viewDB("employee", "manager_id", "employees ordered by manager: ");
    }
  });
}
function viewEmployeesManager(){
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
}
// function to edit employees
function editEmployees(){
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    let employeeData = res;
    inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        pageSize: 25,
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push((res[i].first_name)+" "+(res[i].last_name));
          }
          return choiceArray;
        },
        message: "\nchoose an employee to edit: "
      }
    ])
    .then(function(answer) {
      let chosenEmployee;
      for (var i = 0; i < res.length; i++) {
        if ((res[i].first_name+" "+res[i].last_name) === answer.choice) {
          chosenEmployee = res[i];
        }
      }
      // declare variables
      let roleData = "";
      let roleArr = [];
      // get data from role table
      connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        roleData = res;
        for (var i = 0; i < res.length; i++) {
          roleArr.push(res[i].title);
        }
      });
      
      inquirer.prompt([
        {name: "firstname",
        message: "\nfirst name: ",
        type: "input",
        default: chosenEmployee.first_name},
        {name: "lastname",
        message: "last name: ",
        type: "input",
        default: chosenEmployee.last_name},
        {name: "role",
        message: "role: ",
        type: "list",
        choices: roleArr},
        {name: "manager",
        message: "select manager: ",
        type: "list",
        choices: function(){
          let choiceArray = [];
          for (var i = 0; i < employeeData.length; i++) {
            choiceArray.push((employeeData[i].first_name)+" "+(employeeData[i].last_name));
          }
          return choiceArray;
        }}
      ])
      .then(function(answer){
        // add data to object
        let updateEmployee = {};
        updateEmployee.first_name = answer.firstname;
        updateEmployee.last_name = answer.lastname;
        // find role id based on title
        for (let i = 0; i < roleData.length; i++){
          if (answer.role === roleData[i].title){
            updateEmployee.role_id = roleData[i].id;
          }
        }
        // get employee id based on name
        for (let i = 0; i < employeeData.length; i++){
          if (answer.manager === (employeeData[i].first_name)+" "+(employeeData[i].last_name)){
            updateEmployee.manager_id = employeeData[i].id;
          }
        }
        connection.query( 
          `UPDATE employee SET first_name='${updateEmployee.first_name}', 
          last_name='${updateEmployee.last_name}', 
          role_id='${updateEmployee.role_id}', 
          manager_id='${updateEmployee.manager_id}' 
          WHERE id='${chosenEmployee.id}';`, 
        function(err, res) {
          if (err) throw err;
          console.log(`successfully updated employee ${updateEmployee.first_name} ${updateEmployee.last_name}`);
        });
      })

  });
});
};

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
