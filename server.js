// Importar módulos necesarios
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

// Definir puerto
const PORT = 8888;

// Función para obtener el tipo MIME según la extensión del archivo
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

// Crear el servidor HTTP
const server = http.createServer(async (req, res) => {
    // Parsear la URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${req.method} ${pathname}`);

    // Manejar GET
    if (req.method === 'GET') {
        // Si piden la raíz, servir index.html
        let filePath;
        if (pathname === '/') {
            filePath = path.join(__dirname, 'public', 'index.html');
        } else {
            filePath = path.join(__dirname, 'public', pathname);
        }

        try {
            // Leer el archivo
            const data = await fs.readFile(filePath);
            const mimeType = getMimeType(filePath);

            // Enviar respuesta exitosa
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        } catch (error) {
            // Si el archivo no existe, devolver 404
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <title>404 - No encontrado</title>
                    </head>
                    <body>
                        <h1>Error 404</h1>
                        <p>La página que buscas no existe.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                    </html>
                `);
            } else {
                // Error interno del servidor
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <title>500 - Error interno</title>
                    </head>
                    <body>
                        <h1>Error 500</h1>
                        <p>Error interno del servidor.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                    </html>
                `);
            }
        }
    }
    
    // Manejar POST
    else if (req.method === 'POST') {
        
        // POST /auth/recuperar - Login de demostración
        if (pathname === '/auth/recuperar') {
            let body = '';

            // Leer datos del body
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                // Parsear datos del formulario
                const params = new URLSearchParams(body);
                const usuario = params.get('usuario');
                const clave = params.get('clave');

                // Devolver HTML con los datos
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>AgroTrack - Datos de Login</title>
                        <link rel="stylesheet" href="/estilos.css">
                    </head>
                    <body>
                        <header>
                            <h1>AgroTrack</h1>
                            <p>Portal Web Interno</p>
                        </header>

                        <main>
                            <h2>Datos de Login Recibidos</h2>
                            <p><strong>Usuario:</strong> ${usuario}</p>
                            <p><strong>Clave:</strong> ${clave}</p>
                            <p><a href="/login.html">Volver al login</a></p>
                            <p><a href="/">Volver al inicio</a></p>
                        </main>

                        <footer>
                            <p>&copy; 2025 AgroTrack - Portal Interno</p>
                        </footer>
                    </body>
                    </html>
                `);
            });
        } else {
            // Ruta POST no encontrada
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Ruta no encontrada</h1>');
        }
    }
    
    else {
        // Otros métodos no soportados
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end('<h1>Método no permitido</h1>');
    }
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
