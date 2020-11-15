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
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].title);
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
                  for (let i = 0; i < departmentData.length; i++){
                    if (answer.department===departmentData[i].department_name){
                      let department_answer = departmentData[i].id;
                    }
                  }
                  connection.query("UPDATE role SET title=?, salary=?, department_id=? WHERE id=?;",
                  [answer.title, answer.salary, department_answer, chosenRole.id], function(err, res) {
                if (err) throw err;
                console.log(`successfully updated ${chosenRole.title}`);
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
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)"),
        [answer.title, answer.salary, department_id], function(err, res){
          if (err) throw err;
          console.log(`successfully added new role ${answer.title}`);
        }
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
        })
    })
}
}

module.exports = role;