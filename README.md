# CUCEI MART
<div align="center">
  <img src="public/img/CUCEIMART.jpg" alt="CUCEI MART Logo" width="200"/>
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Node Version](https://img.shields.io/badge/node-18.x-green.svg)](https://nodejs.org/)
  [![Socket.io](https://img.shields.io/badge/socket.io-4.6.1-black.svg)](https://socket.io/)
</div>

## Descripción

**CUCEI MART** es una plataforma integral de comercio electrónico orientada a la comunidad universitaria del Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI). La aplicación promueve la interacción, organización y crecimiento de emprendedores y estudiantes mediante un entorno digital seguro, eficiente y moderno.
### Características Principales
- **Marketplace Universitario**: Explora y descubre emprendimientos de la comunidad CUCEI
- **Chat en Tiempo Real**: Comunícate con otros estudiantes y emprendedores mediante Socket.io
- **Chatbot Inteligente (MART)**: Asistente virtual para responder preguntas frecuentes
- **Búsqueda y Filtros Avanzados**: Encuentra exactamente lo que necesitas
- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles, tablets y desktop
- **Tema Claro/Oscuro**: Personaliza tu experiencia visual
- **Paleta de Colores Elegante**: Diseño profesional con colores modernos
## Tecnologías Utilizadas
### Backend
- **Node.js** (v18.x) - Runtime de JavaScript
- **Express.js** - Framework web
- **Socket.io** - Comunicación en tiempo real
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso
- **Compression** - Compresión de respuestas
- **Express Rate Limit** - Limitación de peticiones
### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos y animaciones
- **JavaScript (ES6+)** - Lógica del cliente
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Iconos
- **Google Fonts** - Tipografías (Inter, Playfair Display)
## Instalación
### Requisitos Previos
- Node.js 18.x o superior
- npm 9.x o superior
- Git
### Pasos de Instalación
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/NEXCODEMX/cucei-mart.git
   cd cucei-mart
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
   O usar el script personalizado:
   ```bash
   npm run install-deps
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus configuraciones.

4. **Iniciar el servidor**
   
   **Modo producción:**
   ```bash
   npm start
   ```
   
   **Modo desarrollo (con nodemon):**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   
   Abre tu navegador y visita: `http://localhost:3000`

## Estructura del Proyecto

```
cucei-mart/
│
├── public/                 # Archivos públicos
│   ├── css/
│   │   └── styles.css     # Estilos principales
│   ├── js/
│   │   └── app.js         # JavaScript del cliente
│   ├── img/               # Imágenes
│   └── index.html         # Página principal
│
├── data/
│   └── businesses.json    # Datos de negocios
│
├── server.js              # Servidor Node.js + Socket.io
├── package.json           # Dependencias y scripts
├── Procfile              # Configuración para Heroku
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore            # Archivos ignorados por Git
└── README.md             # Este archivo
```

## Despliegue en Heroku
### Método 1: Usando Heroku CLI
1. **Instalar Heroku CLI**
   ```bash
   # Windows
   Download from: https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login en Heroku**
   ```bash
   heroku login
   ```

3. **Crear aplicación**
   ```bash
   heroku create cucei-mart-app
   ```

4. **Configurar variables de entorno**
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Desplegar**
   ```bash
   git push heroku main
   ```

6. **Abrir aplicación**
   ```bash
   heroku open
   ```

### Método 2: Usando GitHub

1. Sube tu código a GitHub
2. Conecta tu repositorio con Heroku desde el dashboard
3. Habilita despliegue automático
4. Configura las variables de entorno en Settings → Config Vars

## Uso

### Para Estudiantes

1. **Explorar Negocios**: Navega por la sección de emprendimientos
2. **Buscar**: Usa la barra de búsqueda para encontrar productos específicos
3. **Filtrar**: Selecciona categorías para refinar tu búsqueda
4. **Chat**: Únete al chat comunitario para conectar con otros
5. **Chatbot**: Pregunta al asistente MART sobre horarios, precios, etc.

### Para Emprendedores

1. **Registrar Negocio**: Contacta al equipo NEXCODE
2. **Actualizar Información**: Mantén tus datos actualizados
3. **Interactuar**: Responde a consultas en el chat
4. **Promocionar**: Aprovecha el espacio destacado

## API Endpoints

### GET /api/businesses
Obtiene la lista de todos los emprendimientos registrados.

**Respuesta:**
```json
[
  {
    "id": "sanza-art",
    "name": "SANZA ART",
    "description": "Cuadros Personalizados",
    "category": ["decoraciones", "regalos"],
    "price": "Desde $250 MXN",
    "url": "https://...",
    "isFeatured": true
  }
]
```

### GET /api/health
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2025-02-13T12:00:00.000Z"
}
```

## Socket.io Events

### Cliente → Servidor

- `register` - Registrar usuario en el chat
- `chat_message` - Enviar mensaje al chat
- `chatbot_query` - Consultar al chatbot
- `typing` - Indicar que el usuario está escribiendo

### Servidor → Cliente

- `user_list` - Lista de usuarios conectados
- `chat_history` - Historial de mensajes
- `new_message` - Nuevo mensaje recibido
- `system_message` - Mensaje del sistema
- `user_typing` - Usuario escribiendo
- `chatbot_response` - Respuesta del chatbot

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Roadmap

- [ ] Integración con base de datos PostgreSQL
- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración para emprendedores
- [ ] Sistema de calificaciones y reseñas
- [ ] Notificaciones push
- [ ] Mapa interactivo del campus
- [ ] Sistema de pedidos en línea
- [ ] Pasarela de pagos
- [ ] App móvil nativa

## Requerimientos del Sistema

Según el documento de diseño, la plataforma cumple con:

### Requerimientos Funcionales
- ✅ Gestión de establecimientos
- ✅ Consulta de información
- ✅ Chat en tiempo real
- ✅ Chatbot asistente
- ⏳ Sistema de reseñas (próximamente)

### Requerimientos No Funcionales
- ✅ Usabilidad: Interfaz intuitiva
- ✅ Rendimiento: Carga en menos de 3 segundos
- ✅ Seguridad: Helmet, CORS, Rate limiting
- ✅ Disponibilidad: 99% uptime con Heroku
- ✅ Compatibilidad: Chrome, Firefox, Safari

## Seguridad

- **Helmet.js**: Protección de headers HTTP
- **CORS**: Control de origen cruzado
- **Rate Limiting**: Protección contra ataques DDoS
- **Input Sanitization**: Escape de HTML en mensajes
- **HTTPS**: Conexión segura (en producción)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto y Soporte

### NEXCODE
- **Email**: nexcodemx@gmail.com
- **Instagram**: [@NexCode_MX](https://www.instagram.com/NexCode_MX/)
- **GitHub**: [NEXCODEMX](https://github.com/NEXCODEMX)
- **YouTube**: [@NexCodeMX](https://www.youtube.com/@NexCodeMX)

### Autor Principal
**Fernandez Agraz Rodriguez Ragknos Demian**  
Código: 224786978

---

<div align="center">
  <p>Desarrollado  por NEXCODE</p>
  <p>© 2025 CUCEI MART - Todos los derechos reservados</p>
</div>
