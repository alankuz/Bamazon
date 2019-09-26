CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
   department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);
select *  from products;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone X", "electronics", 1000.99, 50), ("iPhone 8", "electronics", 700.99, 210), ("iPhone 7s ", "electronics", 329.99, 334), ("Hair Brush", "beauty", 14.65, 34), ("Fish Oil 100CT", "health", 4.32, 12), ("BIC Razor 3CT", "health", 2.04, 1003), ("Hair Spray", "beauty", 17.39, 4), ("Large T-shirt", "clothing", 12.99, 433), ("Baseball cap", "clothing", 6.99, 36), ("Chair", "vanity", 32.99, 10);
