# AgroTrack - Portal Web Interno

**Estudiante:** Silvano Puccini
**Legajo:** 35829287 
**Materia:** Programación Web 2
**Universidad:** UNDEF 
**Año:** 2025

---

## Descripción

Portal web interno para la empresa agroindustrial AgroTrack (ficticia).  
Permite consultar información básica, iniciar sesión de demostración y enviar formularios de contacto que se guardan en archivos del servidor.

Desarrollado con **Node.js puro** (sin frameworks como Express), utilizando únicamente módulos nativos: `http`, `fs`, `url`, `path`.

---

## Instalación
Ejecutar: node server.js

### Requisitos previos:
- Node.js instalado 

### Pasos:

1. Clonar el repositorio:
```bash
git clone https://github.com/SilvanoPuccini/agrotrack.git
cd agrotrack
```

2. Ejecutar el servidor:
```bash
node server.js
```

3. Abrir el navegador en:
```
http://localhost:8888
```

---

## Puerto utilizado

El servidor corre en el **puerto 8888**

Para cambiar el puerto, modificar la constante `PORT` en `server.js`

---

## Estructura del proyecto
```
agrotrack/
├── server.js                              # Servidor HTTP principal
├── public/                                # Archivos estáticos
│   ├── index.html                        # Página principal
│   ├── productos.html                    # Página de productos
│   ├── contacto.html                     # Formulario de contacto
│   ├── login.html                        # Formulario de login
│   └── estilos.css                       # Estilos CSS
├── data/                                  # Datos persistentes
│   └── consultas.txt                     # Consultas guardadas (auto-generado)
├── AgroTrack.postman_collection.json     # Colección de Postman
├── .gitignore                            # Archivos ignorados por Git
└── README.md                             # Este archivo
```

---

## Endpoints implementados

### **Archivos estáticos (GET)**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Sirve la página principal (index.html) |
| GET | `/productos.html` | Sirve la página de productos |
| GET | `/contacto.html` | Sirve el formulario de contacto |
| GET | `/login.html` | Sirve el formulario de login |
| GET | `/estilos.css` | Sirve la hoja de estilos |

### **Funcionalidades dinámicas**

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/recuperar` | Procesa el formulario de login y muestra los datos recibidos |
| POST | `/contacto/cargar` | Guarda una consulta de contacto en `data/consultas.txt` |
| GET | `/contacto/listar` | Muestra todas las consultas guardadas |

### **Manejo de errores**

| Código | Descripción |
|--------|-------------|
| 200 | Respuesta exitosa |
| 404 | Página no encontrada |
| 500 | Error interno del servidor |

---

## Ejemplos de uso

### 1. Acceder a la página principal
```
GET http://localhost:8888/
```

### 2. Enviar formulario de login
```
POST http://localhost:8888/auth/recuperar
Body: usuario=Juan&clave=1234
```

**Respuesta:** Página HTML mostrando el usuario y clave recibidos.

### 3. Enviar consulta de contacto
```
POST http://localhost:8888/contacto/cargar
Body: nombre=Juan Pérez&email=jperez@mail.com&mensaje=Consulta sobre servicios
```

**Respuesta:** Página HTML de confirmación.

### 4. Listar todas las consultas
```
GET http://localhost:8888/contacto/listar
```

**Respuesta:** Página HTML mostrando todas las consultas guardadas en formato texto.

---

## Justificación técnica

### **Operaciones asíncronas**

Se utilizan **promesas y async/await** para todas las operaciones de lectura y escritura de archivos, garantizando que el servidor no se bloquee mientras espera operaciones de I/O.

**Ejemplos:**
- `fs.readFile()` - Lectura asíncrona de archivos HTML/CSS
- `fs.appendFile()` - Escritura asíncrona de consultas en el archivo de texto
- `req.on('data')` y `req.on('end')` - Lectura asíncrona del body en requests POST
```javascript
// Ejemplo de lectura asíncrona
const data = await fs.readFile(filePath);
```

### **Manejo de MIME types**

Se implementó una función `getMimeType()` que determina el tipo MIME correcto según la extensión del archivo solicitado.

**Tipos MIME soportados:**
- `.html` → `text/html`
- `.css` → `text/css`
- `.js` → `text/javascript`
- `.json` → `application/json`

Esto asegura que el navegador interprete correctamente cada tipo de archivo.
```javascript
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json'
    };
    return mimeTypes[ext] || 'text/plain';
}
```

### **Manejo de errores**

Se implementaron tres niveles de manejo de errores:

1. **Error 404 (Not Found):**
   - Cuando se solicita un archivo que no existe
   - Cuando se accede a una ruta no definida
   - Responde con HTML personalizado y link para volver al inicio

2. **Error 500 (Internal Server Error):**
   - Cuando ocurre un error al leer/escribir archivos
   - Cuando falla una operación del servidor
   - Responde con HTML informando el error

3. **Error 405 (Method Not Allowed):**
   - Cuando se usa un método HTTP no soportado
   - Responde con mensaje apropiado
```javascript
// Ejemplo de manejo de errores
try {
    const data = await fs.readFile(filePath);
    // ... procesar archivo
} catch (error) {
    if (error.code === 'ENOENT') {
        // Archivo no existe - Error 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        // ...
    } else {
        // Otro error - Error 500
        res.writeHead(500, { 'Content-Type': 'text/html' });
        // ...
    }
}
```

### **Parseo de datos de formularios**

Para procesar los datos enviados por formularios POST, se utiliza:

1. **Event listeners** para capturar el body del request por chunks
2. **URLSearchParams** para parsear datos codificados como `application/x-www-form-urlencoded`
```javascript
let body = '';
req.on('data', chunk => {
    body += chunk.toString();
});
req.on('end', () => {
    const params = new URLSearchParams(body);
    const nombre = params.get('nombre');
    // ...
});
```

### **Persistencia de datos**

Las consultas de contacto se guardan en `data/consultas.txt` usando:
- `fs.appendFile()` - Agrega contenido al final del archivo sin sobrescribir
- Formato estructurado con separadores para facilitar la lectura
- Inclusión automática de fecha y hora usando `new Date().toLocaleString()`

---

## Pruebas con Postman

El proyecto incluye una colección de Postman (`AgroTrack.postman_collection.json`) con todos los endpoints configurados para facilitar las pruebas.

**Para usar la colección:**
1. Abrir Postman
2. Import → Upload Files → Seleccionar `AgroTrack.postman_collection.json`
3. Asegurarse que el servidor esté corriendo
4. Ejecutar los requests de la colección

---

## Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Módulos nativos:**
  - `http` - Servidor HTTP
  - `fs/promises` - Sistema de archivos (asíncrono)
  - `path` - Manejo de rutas
  - `url` - Parseo de URLs

---

## Autor

**Silvano Puccini**  
[spuccini287@alumnos.edu.iua.ar](mailto:spuccini287@alumnos.edu.iua.ar)

---

## Licencia

Este proyecto es de uso académico para la materia Programación Web 2 de UNDEF.
```

---

