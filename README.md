# Proyencto curso Fullstack Polo Tecnológico
## Agenda App API
Este proyecto es una API que obtiene datos de una base de datos MySQL local, para la siguiente aplicación: https://github.com/JuanLisc/Proyecto-Polo-frontend

## Tecnologías

Lista de tecnologías usadas en el proyecto:
* Node.js
* Express
* Sequelize
* Typescript

## Features

Hay dos roles: 'ADMIN' y 'USER'
Para consultar la API debés tener un usuario e iniciar sesión. Actualmente solo un usuario con el role de 'ADMIN' puede crear otros usuarios, por lo que hay que crear el primer usuario directamente en la Base de datos (podés usar DBeaver, MySql Workbench).

Gestión de administrador:
* Creación de usuarios y asginación de roles.
* Eliminación de usuarios.

Gestión de usuario:
* Edición de email y contraseña.

Gestión de meetings:
* Listado
* Creación
* Eliminación

## Variables de entorno

La aplicación utiliza variables de entorno para diversos fines, como configurar la conexión a su base de datos MySQL. Por lo tanto, antes de ejecutar la aplicación, asegúrese de configurar las variables de entorno en el archivo .env (puede seguir el archivo .env.template como guía). Si alguna de las variables de entorno no está configurada correctamente, la aplicación no se iniciará y arrojará un error especificando qué variables de entorno faltan o están mal configuradas.

## Getting Started

1. Clona el repositorio en tu PC:
$ git clon https://github.com/JuanLisc/Proyecto-Polo-backend.git

2.-Navegue al directorio del proyecto:
$ cd Proyecto-Polo-backend

3. Instale las dependencias del proyecto:
$ npm install

4. Cree un archivo .env en la raíz del proyecto y agregue las variables de entorno ayudándose del archivo .env.template.

5. Corra la aplicación:
$ npm run dev
Al correr la aplicación por primera vez, sequelize le creará automaticamente las tablas gracias al comando sync().
