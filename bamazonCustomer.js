
var mysql = require("mysql");
var inquirer = require("inquirer")
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

// Main Menu 

function menu() {
  inquirer
    .prompt([{
      type: "list",
      name: "Menu",
      message: "Welcome. What would you like to do?",
      choices: ["View Items For Sale", "Buy Items", "Seller Hub", "Exit"],
      filter: function (val) { return val.toLowerCase(); }
    }
    ])
    .then(answers => {
      var choice = JSON.parse(JSON.stringify(answers));
      if (choice.Menu === 'view items for sale') {
        connection.query(
          'SELECT * FROM products',
          function (err, res) {
            if (err) throw err;
            console.table('Bamazon overview', res);
            menu();
          })


      }

// ==============Menu Options================

      if (choice.Menu === 'buy items') {
        inquirer
          .prompt([{
            type: "input",
            name: "Item",
            message: "Enter item ID"
          }]).then(answers => {
            var itemnum = JSON.parse(JSON.stringify(answers));
            var choice = itemnum.Item;
            inquirer
              .prompt([{
                type: "input",
                name: "Quantity",
                message: "Choose QTY you want to purchase"
              }]).then(ans => {
                var quannum = JSON.parse(JSON.stringify(ans));
                var quan = quannum.Quantity;
                connection.query(
                  'SELECT stock_quantity FROM products WHERE ?', [{
                    item_id: choice
                  }],
                  function (err, end) {
                    if (err) throw err;
                    var instock = JSON.parse(JSON.stringify(end));
                    var whatleft = parseInt(end[0].stock_quantity)
                    if (whatleft >= quan) {
                      console.log('PURCHASING.....')
                      connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: whatleft - quan
                          },
                          {
                            item_id: choice
                          }
                        ],
                        function (err, res) {
                          if (err) throw err;
                          console.log(res.affectedRows + " products updated!\n");
                          // Call deleteProduct AFTER the UPDATE completes
                          menu();
                        })
                    } else {
                      console.log("=====Not Enough In Stock To Fill Order=====")
                      menu();
                    }
                  })



              })
          })
      }

      // ==============Seller Options================

      if (choice.Menu === 'seller hub') {
        var depart;
        var price;
        var amount;
        inquirer
          .prompt([{
            type: "list",
            name: "Sellmenu",
            message: "Welcome. What would you like to do?",
            choices: ["List Item", "Update Quantity", "Go Back"],
            filter: function (val) { return val.toLowerCase(); }
          }])
          .then(answers => {
            var choice = JSON.parse(JSON.stringify(answers))
            if (choice.Sellmenu === "list item") {
              inquirer
                .prompt([{
                  type: "input",
                  name: "Itemlist",
                  message: 'Enter in following format:product name,department name,price xxx.xx,amount of stock"'
                }]).then(ans => {
                  var newItem = (ans.Itemlist).split(",");
                  connection.query(
                    "INSERT INTO products SET ?",
                    {
                      product_name: newItem[0],
                      department_name: newItem[1],
                      price: parseInt(newItem[2]),
                      stock_quantity: parseInt(newItem[3])
                    },
                    function (err, res) {
                      if (err) throw err;
                      console.log(res.affectedRows + " product inserted!\n");
                      // Call updateProduct AFTER the INSERT completes
                      menu();
                    }
                  );

                })

            }

            if (choice.Sellmenu === "update quantity") {
              inquirer
                .prompt([{
                  type: "input",
                  name: "Item",
                  message: "Enter item ID"
                }]).then(answers => {
                  var itemnum = JSON.parse(JSON.stringify(answers));
                  var choice = itemnum.Item;
                  inquirer
                    .prompt([{
                      type: "input",
                      name: "Quantity",
                      message: "Choose QTY you want to add"
                    }]).then(ans => {
                      var quannum = JSON.parse(JSON.stringify(ans));
                      var quan = quannum.Quantity;
                      connection.query(
                        'SELECT stock_quantity FROM products WHERE ?', [{
                          item_id: choice
                        }],
                        function (err, end) {
                          if (err) throw err;
                          var instock = JSON.parse(JSON.stringify(end));
                          var whatleft = parseInt(end[0].stock_quantity)
                          if (parseInt(quan) > 0) {
                            console.log('PURCHASING.....')
                            connection.query(
                              "UPDATE products SET ? WHERE ?",
                              [
                                {
                                  stock_quantity: +parseInt(whatleft) + +parseInt(quan)
                                },
                                {
                                  item_id: choice
                                }
                              ],
                              function (err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " products updated!\n");
                                // Call deleteProduct AFTER the UPDATE completes
                                menu();
                              })

                          } else {
                            console.log("=====Cannot add negative stock=====")
                            menu();
                          }
                        })
                    })
                })
            }

            if (choice.Sellmenu === "go back") {
              menu();
            }
          });
      }
// ==============Exit================

      if (choice.Menu === 'exit') {
        connection.end();
        console.log('=====Goodbye=====')
      }
    });
}

menu();
