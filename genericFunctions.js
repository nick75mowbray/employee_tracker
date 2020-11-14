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

const genericFunc = {

viewDB: function(table_name, orderBy = "id", message = ""){
    connection.query(`SELECT * FROM ?? ORDER BY ??;`, [table_name, orderBy], function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement using console.table
      genericFunc.outputTable(res, message);
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
  }
}

module.exports = genericFunc;