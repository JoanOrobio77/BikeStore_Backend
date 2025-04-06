# Bikestore - Sistema de Gestión

Sistema de gestión para una tienda de bicicletas que permite administrar productos, categorías, stock, ventas y usuarios.

## Requisitos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- NPM (v6 o superior)

## Configuración

1. Clonar el repositorio:
```
git clone https://github.com/tu-usuario/bikestore.git
cd bikestore
```

2. Instalar dependencias:
```
npm install
```

3. Configurar la base de datos:
   - Editar el archivo `.env` con tus credenciales de MySQL
   - Ejecutar el script `setup_db.bat` para crear la base de datos y los datos iniciales

4. Iniciar el servidor:
```
npm start
```

5. Abrir el archivo `src/frontend/html/index.html` en tu navegador

## Credenciales de acceso

- **Administrador**:
  - Email: admin@bikestore.com
  - Contraseña: admin123

## Estructura del proyecto

```
bikestore/
├── src/
│   ├── config/         # Configuraciones (base de datos, multer, etc.)
│   ├── controllers/    # Controladores de la API
│   ├── db/             # Scripts SQL
│   ├── frontend/       # Frontend (HTML, CSS, JS)
│   ├── middleware/     # Middleware (autenticación, etc.)
│   └── routes/         # Rutas de la API
├── .env                # Variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts
├── README.md           # Documentación
├── server.js           # Punto de entrada de la aplicación
└── setup_db.bat        # Script para configurar la base de datos
```

## Funcionalidades

- Autenticación de usuarios
- Gestión de productos (CRUD)
- Gestión de categorías (CRUD)
- Gestión de stock
- Gestión de ventas
- Gestión de usuarios

## Tecnologías utilizadas

- **Backend**: Node.js, Express, MySQL
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Autenticación**: JWT
- **Base de datos**: MySQL 