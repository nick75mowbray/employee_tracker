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
    startFunction.run();
});

// main menu function
const startFunction = {
  run: function(){
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
        startFunction.budget();
        break;
      default:
        break;
    }
  })
},
// function to view budget
budget: function(){
  connection.query("SELECT SUM(role.salary) budget FROM role INNER JOIN employee ON role.id = employee.role_id;", function(err, res){
    if (err) throw err;
    console.log(`Total budget is: ${res[0].budget}`);
    startFunction.run();
  })
}

} //end startFunction object

// department functions
const department = {
  edit: function(){
      connection.query("SELECT * FROM department", function(err, res){
          if (err) throw err;
          let departmentData = res;
          inquirer.prompt([{
              name: "choice",
              type: "list",
              loop: false,
              choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < res.length; i++) {
                      choiceArray.push(res[i].department_name);
                  }
              return choiceArray;
              },
              message: "\nchoose a department to edit: "
          }]).then(function(answer){
              let chosenDepartment;
              for (let i = 0; i < departmentData.length; i++){
                  if (departmentData[i].department_name===answer.choice){
                      chosenDepartment = departmentData[i];
                  }
              }
              inquirer.prompt([{
                  name: "name",
                  message: "department name: ",
                  default: chosenDepartment.department_name,
                  type: "input"
              }]).then(function(answer){
                  connection.query("UPDATE department SET department_name=? WHERE id=?;",
                  [answer.name, chosenDepartment.id], function(err, res) {
                  if (err) throw err;
                      console.log(`successfully updated ${chosenDepartment.department_name}`);
                      startFunction.run();
                  })
              })
          })
      })
  },
  add: function(){
      inquirer.prompt([{
          name: "name",
          message: "department name: ",
          type: "input"
      }]).then(function(answer){
          connection.query("INSERT INTO department (department_name) VALUES (?)",
          [answer.name], function(err, res){
              if (err) throw err;
              console.log(`successfully added new department ${answer.name}`);
              startFunction.run();
          })
      })
  },
  delete: function(){
      connection.query("SELECT * FROM department", function(err, res) {
          if (err) throw err;
          inquirer
          .prompt([
            {
              name: "choice",
              type: "list",
              pageSize: 25,
              loop: false,
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                  choiceArray.push(res[i].department_name);
                }
                return choiceArray;
              },
              message: "\nchoose an department to delete: "
            }
          ])
          .then(function(answer) {
            let chosenDepartment;
            for (var i = 0; i < res.length; i++) {
              if ((res[i].department_name) === answer.choice) {
                  chosenDepartment = res[i];
              }
            }
            genericFunc.mysqlDelete("department", chosenDepartment.id);
            startFunction.run();
          })
      })
  }
}

// role functions
const role = {
  // function view employees
edit: function(){
  connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      let roleData = res;
      connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        let departmentData = res;
        inquirer
        .prompt([
          {
          name: "choice",
          type: "list",
          pageSize: 25,
          loop: false,
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < roleData.length; i++) {
              choiceArray.push(roleData[i].title);
            }
            return choiceArray;
          },
          message: "\nchoose a role to edit: "
        }
        ])
        .then(function(answer) {
          let chosenRole = {};
          for (let i = 0; i < roleData.length; i++){
              if (roleData[i].title===answer.choice){
                  chosenRole = roleData[i];
              }
          }
          inquirer.prompt([{
              name: "title",
              message: "title: ",
              type: "input",
              default: chosenRole.title
              },
              {name: "salary",
              message: "salary: ",
              type: "number",
              default: chosenRole.salary},
              {name: "department",
              message: "department",
              type: "list",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < departmentData.length; i++) {
                  choiceArray.push(departmentData[i].department_name);
                }
                return choiceArray; },
              default: chosenRole.department_id
              }
              ])
              .then(function(answer){
                // get department id based on user choice
                let department_answer;
                for (let i = 0; i < departmentData.length; i++){
                  if (answer.department===departmentData[i].department_name){
                    department_answer = departmentData[i].id;
                  }
                }
                connection.query("UPDATE role SET title=?, salary=?, department_id=? WHERE id=?;",
                [answer.title, answer.salary, department_answer, chosenRole.id], function(err, res) {
              if (err) throw err;
              console.log(`successfully updated ${chosenRole.title}`);
              startFunction.run();
              })
          
          })
        })
      })    
  })
},
add: function(){
  console.log(`\nAdd new role:\n`)
  connection.query("SELECT * FROM department", function(err, res){
    if (err) throw err;
    let departmentData = res;
    inquirer.prompt([{
      name: "title",
      message: "title: ",
      type: "input"},
      {name: "salary",
      message: "salary: ",
      type: "number"},
      {name: "department",
      message: "department: ",
      type: "list",
      pageSize: 20,
      choices: function(){
        var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].department_name);
            }
            return choiceArray;
          }
      }
    ]).then(function(answer){
      let department_id = 0;
      for (let i = 0; i < departmentData.length; i++){
        if (answer.department===departmentData[i].department_name){
          department_id = departmentData[i].id;
        }
      }
      connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
      [answer.title, answer.salary, department_id], function(err, res){
        if (err) throw err;
        console.log(`successfully added new role ${answer.title}`);
        startFunction.run();
      })
    })
  })
},
delete: function(){
  connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          pageSize: 25,
          loop: false,
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
          message: "\nchoose an role to delete: "
        }
      ])
      .then(function(answer) {
        let chosenRole;
        for (var i = 0; i < res.length; i++) {
          if ((res[i].title) === answer.choice) {
            chosenRole = res[i];
          }
        }
        genericFunc.mysqlDelete("role", chosenRole.id);
        startFunction.run();
      })
  })
}
}

// employee functions
const employee = {
  // function view employees
  view: function(){
    inquirer.prompt({
      name: "sortby",
      message: "\nview employees by:\n",
      type: "list",
      choices: [
        "view all employees",
        "view employees by manager"]
    }).then(function(answers){
      if (answers.sortby==="view all employees"){
        genericFunc.viewDB("employee");
      } else {
        employee.viewManager();
      }
    });
  },
  viewManager: function(){
    // declare variables
    let employeeData = "";
    // get data from role table
    connection.query("SELECT * FROM employee ORDER BY manager_id", function(err, res) {
      if (err) throw err;
      employeeData = res;
      for (var i = 0; i < employeeData.length; i++) {
        for (let j = 0; j < employeeData.length; j++){
          if (employeeData[i].manager_id===employeeData[j].id){
            if (employeeData[i].manager_id=="null"){
              employeeData[i].manager_name = "No Manager";
            } else{
                employeeData[i].manager_name = employeeData[j].first_name+" "+employeeData[j].last_name;
            }
          }
        }
      }
      genericFunc.outputTable(employeeData, "employees ordered by manager: ");
      startFunction.run();
    });
  },
  edit: function(){
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      let employeeData = res;
      inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          pageSize: 25,
          loop: false,
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
            "UPDATE employee SET first_name=?, last_name=?, role_id=?, manager_id=? WHERE id=?;", 
            [updateEmployee.first_name,
            updateEmployee.last_name, 
            updateEmployee.role_id,
            updateEmployee.manager_id,
            chosenEmployee.id], 
          function(err, res) {
            if (err) throw err;
            console.log(`successfully updated employee ${updateEmployee.first_name} ${updateEmployee.last_name}`);
            startFunction.run();
          });
        })
  
    });
  });
  },
  add: function(){
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        let employeeData = res;
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
            message: "first name: ",
            type: "input"},
            {name: "lastname",
            message: "last name: ",
            type: "input"},
            {name: "role",
            message: "role: ",
            type: "list",
            choices: roleArr
            },
            {name: "manager",
            message: "manager",
            type: "list",
            choices: function(){
                let choiceArray = [];
                for (var i = 0; i < employeeData.length; i++) {
                    choiceArray.push((employeeData[i].first_name)+" "+(employeeData[i].last_name));
                }
                return choiceArray;
            }}
      ]).then(function(answer){
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
        //   insert data
          connection.query( 
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", 
            [updateEmployee.first_name,
            updateEmployee.last_name, 
            updateEmployee.role_id,
            updateEmployee.manager_id], 
          function(err, res) {
            if (err) throw err;
            console.log(`successfully added employee ${updateEmployee.first_name} ${updateEmployee.last_name}`);
            startFunction.run();
          });
      })
    });
  },
  delete: function(){
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            pageSize: 25,
            loop: false,
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push((res[i].first_name)+" "+(res[i].last_name));
              }
              return choiceArray;
            },
            message: "\nchoose an employee to delete: "
          }
        ])
        .then(function(answer) {
          let chosenEmployee;
          for (var i = 0; i < res.length; i++) {
            if ((res[i].first_name+" "+res[i].last_name) === answer.choice) {
              chosenEmployee = res[i];
            }
          }
          genericFunc.mysqlDelete("employee", chosenEmployee.id);
          startFunction.run();
        })
    })
}
}

// generic functions
const genericFunc = {

  viewDB: function(table_name, orderBy = "id", message = ""){
      connection.query(`SELECT * FROM ?? ORDER BY ??;`, [table_name, orderBy], function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement using console.table
        genericFunc.outputTable(res, message);
        startFunction.run();
      });
    },
    // function to turn results into a table
    outputTable: function(results, message){
      console.log(`\n${message}`);
      let mytable = [];
        for (let i = 0; i < results.length; i++){
          let tableRow = {};
          tableRow = results[i];
          mytable.push(tableRow);
        }
        const table = cTable.getTable(mytable);
        console.log(`\n${table}`);
    },
    mysqlDelete: function(table_name, id){
      var query = connection.query(
          `DELETE FROM ?? WHERE id=?`,[table_name, id],
          function(err, res) {
            if (err) throw err;
            console.log(`Deleted data with id = ${id} from ${table_name}\n`);
          }
        );
        // logs the actual query being run
        console.log(query.sql);   
    }
  }