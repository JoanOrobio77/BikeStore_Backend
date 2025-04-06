@echo off
echo Configurando la base de datos Bike_Store...

REM Configurar variables
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set DB_USER=root
set DB_PASSWORD=root

REM Verificar si MySQL está instalado
if not exist %MYSQL_PATH% (
    echo Error: MySQL no encontrado en %MYSQL_PATH%
    echo Por favor, instala MySQL Server 8.0 o actualiza la ruta en este script.
    pause
    exit /b 1
)

REM Crear la base de datos y las tablas
echo Creando base de datos y tablas...
%MYSQL_PATH% -u %DB_USER% -p%DB_PASSWORD% < src/db/bikestore.sql
if errorlevel 1 (
    echo Error al crear la base de datos y tablas.
    pause
    exit /b 1
)

REM Insertar datos iniciales
echo Insertando datos iniciales...
%MYSQL_PATH% -u %DB_USER% -p%DB_PASSWORD% Bike_Store < src/db/initial_data.sql
if errorlevel 1 (
    echo Error al insertar datos iniciales.
    pause
    exit /b 1
)

echo Base de datos configurada correctamente.
pause 