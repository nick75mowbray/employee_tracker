const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const genericFunc = require("./genericFunctions.js");

// mysql connection ------
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Mylocalhost34",
    database: "employee_tracker"
  });

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
        })
    })
}
}

module.exports = employee;