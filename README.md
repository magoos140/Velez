## VTEX Analytics API

> 

Este proyecto es una solución completa para una prueba técnica. Incluye:

- Una API backend desarrollada en Express.js.
- Una interfaz frontend con SvelteKit para visualizar y probar los endpoints.
- Collection Postman

### REQUISITOS:

- Node.js versión 20.x
- npm versión 10.9.0 o superior
- MySQL instalado localmente

> 

### CONFIGURACIÓN DEL BACKEND (API):

Clonar el repositorio y entrar en la carpeta del proyecto:
`git clone https://github.com/magoos140/Velez.git`

Desde la raiz del proyecto
`cd api`

Asegurándose de estar en la terminal adentro de la carpeta api :
Instalar dependencias:
`npm install`

Nota: los archivos .env se dejaron en el repositorio solo por facilitar la configuración pero entendiendo que es una mala practica
configurar  archivo .env en la carpeta "api" con el siguiente contenido:
DATABASE_URL="mysql://user:pass@localhost:3306/vtex_analytics"
ACCOUNT_NAME=tu_nombre_de_cuenta
VTEX_ID_CLIENT_AUT_COOKIE=tu_cookie_de_autenticacion
(Reemplazar user, pass, ACCOUNT_NAME y la cookie por tus valores reales)

Asegurándose de estar en la terminal adentro de la carpeta api :
Crear las tablas en la base de datos usando Prisma:
`npx prisma migrate dev`

Nota: Solo si no se crea automáticamente la base de datos "vtex_analytics", crearla manualmente desde MySQL:
CREATE DATABASE vtex_analytics;

Luego volver a ejecutar:
`npx prisma migrate dev`

Generar el cliente de Prisma:
`npx prisma generate`

Iniciar la API:
`npm run dev`

Por defecto corre en el puerto 3000. Si está ocupado, agregar en el archivo .env:
PORT=otro_puerto

> 

### CONFIGURACIÓN DEL FRONTEND (SvelteKit):

Desde la raíz del proyecto, entrar en la carpeta frontend:
`cd frontend`

Instalar dependencias:
`npm install`

Iniciar el servidor de desarrollo:
`npm run dev`

La aplicación estará disponible en: http://localhost:5173

>

## INSTRUCCIONES DE EJECUCIÓN:

Una vez estén levantados tanto el backend como el frontend, se puede acceder a la aplicación desde el navegador a través de la siguiente URL:

http://localhost:5173/

Crear un usuario a través de la interfaz.

Iniciar sesión con ese usuario.

Al ingresar al dashboard, en la parte superior derecha aparecerá un botón para sincronizar los datos desde VTEX.

### Nota:
El tiempo de validez del token de acceso a VTEX fue muy corto, por lo que no se pudo probar completamente la sincronización desde el frontend.

En caso de que la sincronización falle, es posible generar datos de prueba (fixtures) desde la terminal, sin necesidad de tener corriendo el servidor de la API. Para hacerlo:

Asegúrate de estar dentro de la carpeta api.

Ejecuta el siguiente comando:
`node src/generateFixtures.mjs`

Esto generará datos ficticios para poder utilizar la aplicación sin depender de VTEX.

Una vez generadas las fixtures, puedes volver a iniciar la API con:
`npm run dev`

### IMPORTANTE:
La sincronización actual desde VTEX solo trae 100 registros debido a la paginación del endpoint.

Una posible mejora sería implementar un ciclo que recorra todas las páginas detectadas en la respuesta de VTEX, permitiendo sincronizar todos los datos disponibles. Además, sería necesario manejar adecuadamente el uso de memoria y la integridad de los datos para evitar pérdidas o sobrecargas.

Una vez los datos estén disponibles (ya sea por sincronización real o con fixtures), se pueden probar las demás funcionalidades de la aplicación.
Ten en cuenta que algunas funciones requieren IDs de productos o ciudades. Estos pueden obtenerse a través de las opciones:

"Ver items por almacén" (para obtener IDs de producto)

"Buscar ciudades destino" (para obtener IDs de ciudad)

>

## JUSTIFICACIÓN DE DECISIONES TÉCNICAS:

Durante el desarrollo del proyecto tomé una serie de decisiones técnicas orientadas a optimizar el tiempo de entrega, facilitar el despliegue y garantizar un funcionamiento estable y seguro del sistema. A continuación, detallo y justifico cada una de ellas:

### Uso de Express.js
Opté por utilizar Express.js como framework para el backend debido a su simplicidad y velocidad de configuración. Esta elección se fundamenta en el hecho de que se contaba con un tiempo limitado para realizar múltiples tareas, y Express permite levantar APIs de manera ágil sin necesidad de configurar entornos adicionales como Nginx o Apache. Esto también facilita la instalación para quien revise la prueba, ya que sólo requiere tener Node.js instalado.
Si bien una opción ideal hubiera sido dockerizar todo el entorno para un despliegue más controlado, por restricciones de tiempo no fue posible implementar esa parte.

### Base de datos relacional: MySQL
Para el almacenamiento de datos, seleccioné MySQL por tratarse de una base de datos relacional robusta que facilita la modelación de entidades con relaciones bien definidas. Esto resultó especialmente útil para dar respuesta a las preguntas planteadas en la prueba técnica, donde era importante evitar la duplicidad de datos y mantener integridad referencial. Las relaciones entre entidades facilitaron las consultas y permitieron estructurar los datos de forma coherente.

### ORM Prisma
Utilicé Prisma como ORM para agilizar la creación del esquema de base de datos y la interacción con MySQL. Prisma permitió definir el modelo de datos de forma clara, generar migraciones automáticamente y realizar consultas de manera tipada y segura, lo que redujo el riesgo de errores y aceleró el desarrollo.

### Gestión de credenciales y configuración sensible
Para manejar las variables de entorno, como las credenciales de la base de datos y el token de autenticación de VTEX, utilicé un archivo .env. Esto permite separar la lógica del código de los valores sensibles, siguiendo buenas prácticas de seguridad y facilitando el despliegue en distintos entornos sin modificar el código base.

### Autenticación con JWT y seguridad de endpoints
Implementé JSON Web Tokens (JWT) para controlar el acceso a los endpoints de la API. De esta forma, se requiere autenticación para consumir los servicios, protegiendo tanto los recursos como el token de VTEX, que no se expone directamente desde el frontend. Esta medida también refuerza la separación de responsabilidades entre cliente y servidor.

### Restricción de orígenes con CORS
Para prevenir accesos no autorizados a la API, configuré CORS para permitir solicitudes únicamente desde el puerto correspondiente al entorno del frontend. Esto añade una capa básica de seguridad al restringir el origen de las peticiones HTTP.

### Frontend con SvelteKit
Para construir la interfaz de usuario utilicé SvelteKit, un framework moderno que permite crear aplicaciones web reactivas con un rendimiento óptimo. La curva de aprendizaje es corta, el arranque del proyecto es rápido y su integración con entornos Node es muy sencilla, lo cual fue ideal dadas las condiciones de la prueba. Esto permitió mostrar de forma clara el funcionamiento de la API sin necesidad de una interfaz compleja.

### Estructura del backend: rutas y controladores
La API fue estructurada utilizando rutas y controladores separados, con el fin de mantener un código limpio, organizado y fácilmente escalable. Esta división favorece la mantenibilidad y facilita la lectura y comprensión del flujo de datos dentro de la aplicación.

## Ejemplo de uso de la API.

En la siguiente URL se encuentra una colección de Postman que contiene ejemplos para probar los distintos endpoints de la API:

Importante:

Los únicos endpoints que no requieren autenticación (Bearer token) son los de registro y login de usuario.

Todos los demás endpoints requieren que se incluya el token en los headers de la solicitud con el siguiente formato:

`Authorization: Bearer <token>`

Este token se obtiene al hacer una solicitud exitosa al endpoint de login. El token viene incluido en la respuesta y debe ser usado para acceder a los demás endpoints protegidos.

URL:  https://www.postman.com/security-engineer-32030761/prueba-tecnica/collection/o1b3ugo/prueba-tecnica-mateo-gonzalez?action=share&creator=26935666

## BONUS – VISUALIZACIONES EXPLICADAS

El frontend incluye una serie de vistas que permiten interactuar con la API y visualizar los datos de forma sencilla. A continuación se describen cada una de ellas y su propósito:

Vista principal (Login / Registro)
Permite al usuario registrarse o iniciar sesión. Estas acciones son necesarias para obtener el token JWT que se utiliza para autenticar todas las demás solicitudes a la API.

### Dashboard
Es el panel principal al que se accede luego de iniciar sesión. Desde aquí se pueden acceder a las distintas funciones del sistema y también ejecutar la sincronización de datos desde VTEX.

### Warehouse
Muestra la lista de almacenes registrados. Al seleccionar un almacén, se visualizan los productos asociados y la información detallada de los envíos realizados desde ese almacén.

### Products
Permite buscar desde qué almacén se envía un producto específico. Esta vista es útil para rastrear la procedencia de un ítem determinado.

### City
Permite buscar qué almacenes están habilitados para enviar productos a una ciudad determinada. Es útil para consultar la cobertura logística por destino.

### Movements
Ofrece la posibilidad de filtrar los productos que han generado una orden dentro de un rango de fechas específico. Esto permite hacer un seguimiento temporal de los movimientos registrados.
