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
                default: chosenRole.salary}])
            connection.query("SELECT * FROM role", function(err, res) {
                if (err) throw err;
            })
        })
    })    
  },
}

module.exports = role;