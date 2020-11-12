DROP DATABASE if EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NULL,
    PRIMARY KEY (id),
);

CREATE TABLE manager (
    id INT AUTO_INCREMENT NOT NULL,
    department_id INT NULL,
    manager_first_name VARCHAR(50) NULL,
    manager_last_name VARCHAR(50) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    department_id INT NULL,
    title VARCHAR(50) NULL,
    salary DECIMAL(10, 2) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    manager_id INT NULL,
    role_id INT NOT NULL,
    first_name VARCHAR(40) NULL,
    last_name VARCHAR(40) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES manager(id)
);

-- insert dummy data