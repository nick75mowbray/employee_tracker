const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const genericFunc = require("./genericFunctions.js");
const { delete } = require("./roleFunctions.js");

// mysql connection ------
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Mylocalhost34",
    database: "employee_tracker"
  });

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
                let chosenDepartment = {};
                for (let i = 0; i < departmentData.length; i++){
                    if (departmentData[i].title===answer.choice){
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
            connection.query("INSERT INTO department (department_name) VALUES (?)"),
            [answer.name], function(err, res){
                if (err) throw err;
                console.log(`successfully added new department ${answer.name}`);
            }
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
            })
        })
    }
}
module.exports = department;