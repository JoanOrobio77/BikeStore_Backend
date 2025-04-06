Create DATABASE Bike_Store;
Use Bike_Store;

create table rol(
	id_rol int primary key auto_increment,
    nombre_rol varchar(50)
);

CREATE TABLE Usuarios(
id_usuario INT auto_increment primary key,
nombre varchar (50),
telefono varchar (20),
email varchar (100),
contrasena varchar (500),
id_rol INT,
foreign key (id_rol) references rol(id_rol)
);

create table Categoria (
id_categoria INT auto_increment primary key,
nombre_categoria varchar (40)
);

create table Producto (
id_producto INT auto_increment primary key,
nombre_producto varchar (100),
descripcion TEXT,
precio decimal(10,2),
imagen BLOB,
id_categoria INT,
foreign key (id_categoria) references Categoria(id_categoria)
);

Create table Stock (
id_stock int auto_increment primary key,
id_producto INT,
cantidad int,
fecha_ingreso date, 
fecha_salida date,
foreign key (id_producto) references Producto(id_producto)
);

create table Ventas (
id_venta INT auto_increment primary key,
fecha_venta date,
id_usuario INT,
total decimal(10,2),
foreign key (id_usuario) references Usuarios(id_usuario)
);

create table Detalle_Venta (
id_detalle_venta INT auto_increment primary key,
id_venta INT,
id_producto INT,
cantidad INT,
precio_unitario decimal(10,2),
subtotal decimal(10,2),
foreign key (id_venta) references Ventas(id_venta),
foreign key (id_producto) references Producto(id_producto)
);
