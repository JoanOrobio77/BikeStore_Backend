DROP DATABASE IF EXISTS Bike_Store;
CREATE DATABASE Bike_Store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Bike_Store;

create table rol(
    id_rol int primary key auto_increment,
    nombre_rol varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);

CREATE TABLE Usuarios(
    id_usuario INT auto_increment primary key,
    nombre varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    telefono varchar(20) NOT NULL,
    email varchar(100) NOT NULL,
    contrasena varchar(500) NOT NULL,
    id_rol INT NOT NULL,
    foreign key (id_rol) references rol(id_rol)
);

create table Categoria (
    id_categoria INT auto_increment primary key,
    nombre_categoria varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);

create table Producto (
    id_producto INT auto_increment primary key,
    nombre_producto varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    descripcion TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    precio decimal(10,2) NOT NULL,
    imagen MEDIUMBLOB,
    id_categoria INT NOT NULL,
    foreign key (id_categoria) references Categoria(id_categoria)
);

Create table Stock (
    id_stock int auto_increment primary key,
    id_producto INT NOT NULL,
    cantidad int NOT NULL DEFAULT 0,
    fecha_ingreso date NOT NULL, 
    fecha_salida date,
    foreign key (id_producto) references Producto(id_producto)
);

create table Ventas (
    id_venta INT auto_increment primary key,
    fecha_venta date NOT NULL,
    id_usuario INT NOT NULL,
    total decimal(10,2) NOT NULL,
    foreign key (id_usuario) references Usuarios(id_usuario)
);

create table Detalle_Venta (
    id_detalle_venta INT auto_increment primary key,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario decimal(10,2) NOT NULL,
    subtotal decimal(10,2) NOT NULL,
    foreign key (id_venta) references Ventas(id_venta),
    foreign key (id_producto) references Producto(id_producto)
);

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