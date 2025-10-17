// Importar módulos necesarios
const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const url = require("url");

// Definir puerto
const PORT = 8888;

// Función para obtener el tipo MIME según la extensión del archivo
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
  };
  return mimeTypes[ext] || "text/plain";
}

// Crear el servidor HTTP
const server = http.createServer(async (req, res) => {
  // Parsear la URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  // Manejar GET
  if (req.method === "GET") {
    // GET /contacto/listar - Mostrar consultas guardadas
    if (pathname === "/contacto/listar") {
      try {
        const filePath = path.join(__dirname, "data", "consultas.txt");
        const data = await fs.readFile(filePath, "utf8");

        // Si tiene contenido, mostrarlo
        if (data.trim().length > 0) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Consultas</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Consultas Recibidas</h2>
                                <pre>${data}</pre>
                                <p>
                                    <a href="/contacto.html">Enviar nueva consulta</a>
                                    <a href="/">Volver al inicio</a>
                                </p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        } else {
          // Archivo vacío
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Consultas</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Consultas Recibidas</h2>
                                <p>Aún no hay consultas registradas.</p>
                                <p>
                                    <a href="/contacto.html">Enviar nueva consulta</a>
                                    <a href="/">Volver al inicio</a>
                                </p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        }
      } catch (error) {
        // Archivo no existe
        if (error.code === "ENOENT") {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Consultas</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Consultas Recibidas</h2>
                                <p>Aún no hay consultas registradas.</p>
                                <p>
                                    <a href="/contacto.html">Enviar nueva consulta</a>
                                    <a href="/">Volver al inicio</a>
                                </p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        } else {
          // Error interno
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Error</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Error 500</h2>
                                <p>Error interno del servidor al leer las consultas.</p>
                                <p><a href="/">Volver al inicio</a></p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        }
      }
    }

    // Servir archivos estáticos
    else {
      let filePath;
      if (pathname === "/") {
        filePath = path.join(__dirname, "public", "index.html");
      } else {
        filePath = path.join(__dirname, "public", pathname);
      }

      try {
        const data = await fs.readFile(filePath);
        const mimeType = getMimeType(filePath);

        res.writeHead(200, { "Content-Type": mimeType });
        res.end(data);
      } catch (error) {
        if (error.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - 404</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Error 404 - Página No Encontrada</h2>
                                <p>Lo sentimos, la página que buscas no existe.</p>
                                <p><a href="/">Volver al inicio</a></p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        } else {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Error</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Error 500</h2>
                                <p>Error interno del servidor.</p>
                                <p><a href="/">Volver al inicio</a></p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        }
      }
    }
  }

  // Manejar POST
  else if (req.method === "POST") {
    // POST /auth/recuperar - Login de demostración
    if (pathname === "/auth/recuperar") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const params = new URLSearchParams(body);
        const usuario = params.get("usuario");
        const clave = params.get("clave");

        res.writeHead(200, { "Content-Type": "text/html" });
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

                        <nav>
                            <a href="/">Inicio</a>
                            <a href="/productos.html">Productos</a>
                            <a href="/contacto.html">Contacto</a>
                            <a href="/login.html">Login</a>
                        </nav>

                        <main>
                            <h2>Datos de Login Recibidos</h2>
                            <p><strong>Usuario:</strong> ${usuario}</p>
                            <p><strong>Contraseña:</strong> ${clave}</p>
                            <p>
                                <a href="/login.html">Volver al login</a>
                                <a href="/">Volver al inicio</a>
                            </p>
                        </main>

                        <footer>
                            <p>&copy; 2025 AgroTrack - Portal Interno</p>
                        </footer>
                    </body>
                    </html>
                `);
      });
    }

    // POST /contacto/cargar - Guardar consulta
    else if (pathname === "/contacto/cargar") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const params = new URLSearchParams(body);
          const nombre = params.get("nombre");
          const email = params.get("email");
          const mensaje = params.get("mensaje");

          const fecha = new Date().toLocaleString("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          const consulta = `-------------------------
Fecha: ${fecha}
Nombre: ${nombre}
Email: ${email}
Mensaje: ${mensaje}
-------------------------

`;

          const filePath = path.join(__dirname, "data", "consultas.txt");
          await fs.appendFile(filePath, consulta, "utf8");

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Consulta Enviada</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>¡Consulta Enviada Exitosamente!</h2>
                                <p>Gracias <strong>${nombre}</strong>, tu consulta ha sido guardada correctamente.</p>
                                <p>Te contactaremos a la brevedad en: <strong>${email}</strong></p>
                                <p>
                                    <a href="/contacto.html">Enviar otra consulta</a>
                                    <a href="/contacto/listar">Ver todas las consultas</a>
                                    <a href="/">Volver al inicio</a>
                                </p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        } catch (error) {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>AgroTrack - Error</title>
                            <link rel="stylesheet" href="/estilos.css">
                        </head>
                        <body>
                            <header>
                                <h1>AgroTrack</h1>
                                <p>Portal Web Interno</p>
                            </header>

                            <nav>
                                <a href="/">Inicio</a>
                                <a href="/productos.html">Productos</a>
                                <a href="/contacto.html">Contacto</a>
                                <a href="/login.html">Login</a>
                            </nav>

                            <main>
                                <h2>Error 500</h2>
                                <p>Error al guardar la consulta.</p>
                                <p><a href="/contacto.html">Intentar nuevamente</a></p>
                            </main>

                            <footer>
                                <p>&copy; 2025 AgroTrack - Portal Interno</p>
                            </footer>
                        </body>
                        </html>
                    `);
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>AgroTrack - 404</title>
                    <link rel="stylesheet" href="/estilos.css">
                </head>
                <body>
                    <header>
                        <h1>AgroTrack</h1>
                        <p>Portal Web Interno</p>
                    </header>

                    <nav>
                        <a href="/">Inicio</a>
                        <a href="/productos.html">Productos</a>
                        <a href="/contacto.html">Contacto</a>
                        <a href="/login.html">Login</a>
                    </nav>

                    <main>
                        <h2>Ruta No Encontrada</h2>
                        <p>La ruta solicitada no existe.</p>
                        <p><a href="/">Volver al inicio</a></p>
                    </main>

                    <footer>
                        <p>&copy; 2025 AgroTrack - Portal Interno</p>
                    </footer>
                </body>
                </html>
            `);
    }
  } else {
    res.writeHead(405, { "Content-Type": "text/html" });
    res.end(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AgroTrack - 405</title>
                <link rel="stylesheet" href="/estilos.css">
            </head>
            <body>
                <header>
                    <h1>AgroTrack</h1>
                    <p>Portal Web Interno</p>
                </header>

                <nav>
                    <a href="/">Inicio</a>
                    <a href="/productos.html">Productos</a>
                    <a href="/contacto.html">Contacto</a>
                    <a href="/login.html">Login</a>
                </nav>

                <main>
                    <h2>Método No Permitido</h2>
                    <p>El método HTTP utilizado no está permitido.</p>
                    <p><a href="/">Volver al inicio</a></p>
                </main>

                <footer>
                    <p>&copy; 2025 AgroTrack - Portal Interno</p>
                </footer>
            </body>
            </html>
        `);
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
