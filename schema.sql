-- Create a MySQL Database called bamazon --
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

-- Create a Table inside of that database called products --
CREATE TABLE products(
    -- products table should have each of the following columns: --
        -- item_id (unique id for each product) --
        item_id INT AUTO_INCREMENT NOT NULL,
        -- product_name (Name of product) --
        product_name VARCHAR(255) NOT NULL,
        -- department_name --
        department_name VARCHAR(255) NOT NULL,
        -- price (cost to customer) --
        price DECIMAL(10,2) NOT NULL,
        -- stock_quantity (how much of the product is available in stores) --
        stock_quantity INT(10) NOT NULL,
        -- set primary key to the item_id --
        PRIMARY KEY (item_id)
);