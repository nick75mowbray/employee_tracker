
-- insert dummy data
INSERT INTO department (department_name) VALUES
("Sales"),
("Accounting"),
("Marketing"),
("Administation"),
('Engineering');

INSERT INTO role (department_id, title, salary) VALUES
(1, "Sales Assistant", 50000),
(5, "Lead Engineer", 120000),
(5, "Junior Developer", 65000),
(2, "Lead Accountant", 80000),
(3, "Director of Marketing", 100000),
(3, "Creative Director", 95000),
(1, "Sales Person", 65000),
(4, "Receptionist", 55000),
(2, "Tax Specialist", 75000),
(4, "Human Resources Manager", 80000),
-- manager positions
(1, "Sales Manager", 100000),
(2, "Accounts Manager", 100000),
(3, "Marketing Manager", 95000),
(4, "Administration Manager", 95000),
(5, "Engineering Manager", 110000);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
-- managers
("Johnson", "Lloyd", 11, NULL),
("Jermaine", "Alexander", 12, NULL),
("Dee", "Knapp", 13, NULL),
("Kennith", "Gould", 14, NULL),
("Dino", "Ramos", 15, NULL),
("Delbert", "Gross", 11, NULL),
("Jaime", "Barrera", 12, NULL),
("Edmond", "Hall", 13, NULL),
("Faith", "Bush", 14, NULL),
("Homer", "Bean", 15, NULL),
-- regular employees
("Adele", "Kerr", 1, 1),
("Carmela", "Beck", 2, 2),
("Andrea", "Dunlap", 3, 3),
("Leanna", "Solomon", 4, 4),
("Elinor", "Summers", 5, 5),
("Cherry", "Dodson", 6, 6),
("Jaime", "Logan", 7, 7),
("Elmer", "Rosales", 8, 8),
("Felipe", "Hood", 9, 9),
("Hans", "Benson", 10, 10),
("Demarcus", "Serrano", 1, 1),
("Fletcher", "Elliott", 2, 2),
("Patsy", "Lowery", 3, 3),
("Edmundo", "Mcneil", 4, 4),
("Geneva", "Lester", 5, 5),
("Sondra", "Gross", 6, 6),
("Jaime", "Ayala", 7, 7),
("Nathaniel", "Melton", 8, 8),
("Clarice", "Lee", 9, 9),
("Lila", "Sheppard", 10, 10);