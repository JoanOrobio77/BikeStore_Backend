-- Insertar roles
INSERT INTO rol (nombre_rol) VALUES ('Administrador');
INSERT INTO rol (nombre_rol) VALUES ('Usuario');

-- Insertar usuario administrador (contraseña: admin123)
INSERT INTO Usuarios (nombre, telefono, email, contrasena, id_rol) 
VALUES ('Administrador', '123456789', 'admin@bikestore.com', '$2a$10$GxlEVHQQZWXs1KoHtHBQF.8HQ9Ld9SEPwqwXd3pYoLhqnL/6SCYxq', 1);

-- Insertar categorías
INSERT INTO Categoria (nombre_categoria) VALUES ('Mountain Bike');
INSERT INTO Categoria (nombre_categoria) VALUES ('Bicicleta de Ruta');
INSERT INTO Categoria (nombre_categoria) VALUES ('Bicicleta Urbana');
INSERT INTO Categoria (nombre_categoria) VALUES ('Bicicleta para Niños');

-- Insertar productos
INSERT INTO Producto (nombre_producto, descripcion, precio, id_categoria) 
VALUES ('Mountain Bike Pro', 'Bicicleta de montaña profesional', 1200.00, 1);

INSERT INTO Producto (nombre_producto, descripcion, precio, id_categoria) 
VALUES ('Ruta Elite', 'Bicicleta de ruta de alta gama', 1500.00, 2);

INSERT INTO Producto (nombre_producto, descripcion, precio, id_categoria) 
VALUES ('Ciudad Comfort', 'Bicicleta urbana cómoda', 800.00, 3);

INSERT INTO Producto (nombre_producto, descripcion, precio, id_categoria) 
VALUES ('Kids Fun', 'Bicicleta para niños', 300.00, 4);

-- Insertar stock
INSERT INTO Stock (id_producto, cantidad, fecha_ingreso) VALUES (1, 10, CURDATE());
INSERT INTO Stock (id_producto, cantidad, fecha_ingreso) VALUES (2, 8, CURDATE());
INSERT INTO Stock (id_producto, cantidad, fecha_ingreso) VALUES (3, 15, CURDATE());
INSERT INTO Stock (id_producto, cantidad, fecha_ingreso) VALUES (4, 20, CURDATE()); 