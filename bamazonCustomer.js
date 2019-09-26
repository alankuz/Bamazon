
var mysql = require("mysql");
var inquirer = require("inquirer")
var fs = require("fs")
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "alan",
    database: "bamazon"
});
function menu (){
inquirer
  .prompt([{
    type: "list",
    name: "Menu",
    message: "Welcome. What would you like to do?",
    choices: [ "View Items For Sale", "Buy Items", "Exit" ],
    filter: function( val ) { return val.toLowerCase(); }
  }
  ])
  .then(answers => {
      var choice = JSON.parse(JSON.stringify(answers));
      console.log(choice.Menu)
      if(choice.Menu==='view items for sale') {
        var query = connection.query(
            'SELECT * FROM products', 
            function (err, res) {
                if (err) throw err;
                console.table('Bamazon overveiw', res);
                menu();
            })
            
            
      }
      if(choice.Menu==='exit') {
        connection.end();
        console.log('=====Goodbye=====')

    }
      

  });}

menu();
