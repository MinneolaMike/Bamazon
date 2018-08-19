// Require the 3 npm packages -- mysql, inquirer, chalk, & console.table
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const chalk = require('chalk');

// Variable to store the item selected
var selectedItem = "";

// Connecting the SQL database bamazon and intiating the first function
var connection = mysql.createConnection({
    // Host
    host: "localhost",
    // Port
    port: 3306,
    // Username
    user: "root",
    // Password
    password: "root",
    // Database
    database: "bamazon"
});
// Connection.connect
connection.connect(function (err) {
    if (err) throw err;
    // Callback for showItemsForSale function
    showItemsForSale();
});

// Main function for bamazon
function showItemsForSale() {
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        console.table(result);
        // Using inquirer to prompt the user
        inquirer
            .prompt([
                {
                    name: "what",
                    type: "input",
                    message: "What is the Item ID of the product you would like to purchase? ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "howMany",
                    type: "input",
                    message: "How many would you like to purchase? ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            // THEN check to make sure there is enough of the item for purchase
            .then(function (answer) {
                // console.log(result);
                // Loop over all the items in the products table looking for the item the buyer chose
                for (var i = 0; i < result.length; i++) {
                    if (result[i].item_id === parseInt(answer.what)) {
                        // Set selectedItem = to the item selected from the database
                        selectedItem = result[i];
                    }
                }

                // If there is not enough of the item, inform the buyer and have them choose again
                if (parseInt(answer.howMany) > selectedItem.stock_quantity) {
                    console.log(chalk.red("=========================================================================="))
                    console.log(chalk.red("We don't have enough of that item available...\nPlease select a different item or change the quantity."));
                    console.log(chalk.red("--------------------------------------------------------------------------"))
                    console.log(chalk.red("--------------------------------------------------------------------------"))
                    showItemsForSale();
                    // If not show them their total, update the table, and start the process over
                } else {
                    console.log(chalk.green("============================================================================"))
                    console.log(chalk.green("ORDER SUCCESSFUL!!! YOUR TOTAL IS $" + (selectedItem.price * parseInt(answer.howMany)).toFixed(2)));
                    console.log(chalk.green("----------------------------------------------------------------------------"))
                    console.log(chalk.green("----------------------------------------------------------------------------"));
                    // Variable for the new stock_quantity
                    var newQty = parseInt(selectedItem.stock_quantity) - parseInt(answer.howMany);
                    // Update the table
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: newQty
                        },
                        {
                            item_id: answer.what
                        }],
                        function (err) {
                            if (err) throw err;
                        })
                    // Callback to start the process over
                    showItemsForSale();
                }
            })
    }
    )
}

