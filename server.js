const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.socket.io"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use('/api/', limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/businesses', (req, res) => {
    const businesses = require('./data/businesses.json');
    res.json(businesses);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const activeSessions = new Map();
const chatHistory = [];

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    
    socket.on('register', (username) => {
        activeSessions.set(socket.id, {
            id: socket.id,
            username: username || `Usuario${Math.floor(Math.random() * 1000)}`,
            joinedAt: new Date()
        });
        
        io.emit('user_list', Array.from(activeSessions.values()));
        
        socket.emit('chat_history', chatHistory.slice(-50));
        
        io.emit('system_message', {
            type: 'join',
            message: `${activeSessions.get(socket.id).username} se ha unido al chat`,
            timestamp: new Date()
        });
    });
    
    socket.on('chat_message', (data) => {
        const user = activeSessions.get(socket.id);
        if (!user) return;
        
        const message = {
            id: Date.now(),
            userId: socket.id,
            username: user.username,
            message: data.message,
            timestamp: new Date()
        };
        
        chatHistory.push(message);
        
        if (chatHistory.length > 200) {
            chatHistory.shift();
        }
        
        io.emit('new_message', message);
    });
    
    socket.on('chatbot_query', (query) => {
        const response = getChatbotResponse(query);
        socket.emit('chatbot_response', {
            query: query,
            response: response,
            timestamp: new Date()
        });
    });
    
    socket.on('typing', () => {
        const user = activeSessions.get(socket.id);
        if (user) {
            socket.broadcast.emit('user_typing', user.username);
        }
    });
    
    socket.on('disconnect', () => {
        const user = activeSessions.get(socket.id);
        if (user) {
            io.emit('system_message', {
                type: 'leave',
                message: `${user.username} ha salido del chat`,
                timestamp: new Date()
            });
            activeSessions.delete(socket.id);
            io.emit('user_list', Array.from(activeSessions.values()));
        }
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

function getChatbotResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes('hola') || q.includes('buenos días') || q.includes('buenas tardes')) {
        return 'Hola, bienvenido a CUCEI MART. ¿En qué puedo ayudarte hoy?';
    }
    
    if (q.includes('horario') || q.includes('hora')) {
        return 'La mayoría de los emprendimientos operan en horarios de clases. Te recomiendo revisar cada negocio específico en la plataforma.';
    }
    
    if (q.includes('comida') || q.includes('comer')) {
        return 'Contamos con diversos emprendimientos de comida. Puedes filtrar por categoría "Alimentos" en la página principal.';
    }
    
    if (q.includes('precio') || q.includes('costo')) {
        return 'Los precios varían según el emprendimiento. Cada negocio tiene su información de precios en su perfil.';
    }
    
    if (q.includes('ayuda') || q.includes('soporte')) {
        return 'Para soporte técnico, puedes enviarnos un email a nexcodemx@gmail.com o visitar la sección de Soporte en el menú.';
    }
    
    if (q.includes('emprendedor') || q.includes('vender')) {
        return 'Si deseas registrar tu emprendimiento en CUCEI MART, por favor contacta a nuestro equipo en nexcodemx@gmail.com.';
    }
    
    return 'Gracias por tu mensaje. Para información más específica, te recomiendo explorar nuestra plataforma o contactar a soporte técnico.';
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

server.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║      CUCEI MART Server Running       ║
    ║      Port: ${PORT}                       ║
    ║      Environment: ${process.env.NODE_ENV || 'development'}         ║
    ╚═══════════════════════════════════════╝
    `);
});

module.exports = { app, server };
