@echo off
echo Configurando la base de datos Bike_Store...

REM Eliminar la base de datos si existe
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "DROP DATABASE IF EXISTS Bike_Store;"

REM Crear la base de datos y las tablas
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < src/db/setup_db.sql

if %ERRORLEVEL% EQU 0 (
    echo Base de datos configurada exitosamente.
) else (
    echo Error al configurar la base de datos.
)

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

REM Insertar datos iniciales
echo Insertando datos iniciales...
%MYSQL_PATH% -u %DB_USER% -p%DB_PASSWORD% Bike_Store < src/db/initial_data.sql
if errorlevel 1 (
    echo Error al insertar datos iniciales.
    pause
    exit /b 1
)

pause 