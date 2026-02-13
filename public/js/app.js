const socket = io();
let currentUser = null;
let businesses = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadBusinesses();
    setupEventListeners();
    setupChat();
    setupChatbot();
});

function initializeApp() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

async function loadBusinesses() {
    try {
        const response = await fetch('/api/businesses');
        businesses = await response.json();
        renderBusinesses(businesses);
    } catch (error) {
        console.error('Error cargando negocios:', error);
        showError('No se pudieron cargar los emprendimientos');
    }
}

function renderBusinesses(businessesToRender) {
    const grid = document.getElementById('businessesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (businessesToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h3>No se encontraron resultados</h3>
                <p class="text-muted">Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    businessesToRender.forEach(business => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        const categories = Array.isArray(business.category) 
            ? business.category.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
            : business.category.charAt(0).toUpperCase() + business.category.slice(1);
        
        col.innerHTML = `
            <div class="business-card" onclick="window.open('${business.url}', '_blank')">
                <div class="business-image">
                    <img src="${business.image}" alt="${business.name}" onerror="this.src='img/placeholder.jpg'">
                </div>
                <h3>${business.name}</h3>
                <p>${business.description}</p>
                <div class="business-category">
                    <i class="${business.icon}"></i>
                    <span>${categories}</span>
                </div>
                <div style="font-weight: 700; color: var(--primary-color); margin: 0 1.5rem 1rem; font-size: 1.1rem;">
                    ${business.price}
                </div>
                <button class="business-btn">
                    <i class="fas fa-external-link-alt"></i> Ver Negocio
                </button>
            </div>
        `;
        
        grid.appendChild(col);
    });
}

function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = businesses.filter(business => {
        const categories = Array.isArray(business.category) 
            ? business.category.join(' ').toLowerCase()
            : business.category.toLowerCase();
            
        return business.name.toLowerCase().includes(searchTerm) ||
               business.description.toLowerCase().includes(searchTerm) ||
               categories.includes(searchTerm);
    });
    
    renderBusinesses(filtered);
}

function handleFilter(e) {
    const category = e.currentTarget.dataset.category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    let filtered = businesses;
    if (category !== 'todos') {
        filtered = businesses.filter(business => {
            if (Array.isArray(business.category)) {
                return business.category.includes(category);
            }
            return business.category === category;
        });
    }
    
    renderBusinesses(filtered);
}

function setupChat() {
    const joinChatBtn = document.getElementById('joinChat');
    const sendMessageBtn = document.getElementById('sendMessage');
    const usernameInput = document.getElementById('username');
    const messageTextInput = document.getElementById('messageText');
    
    if (joinChatBtn) {
        joinChatBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (username) {
                currentUser = username;
                socket.emit('register', username);
                
                document.getElementById('usernameInput').style.display = 'none';
                document.getElementById('messageInput').style.display = 'block';
                
                document.getElementById('chatMessages').innerHTML = '';
            }
        });
        
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                joinChatBtn.click();
            }
        });
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
        
        messageTextInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        let typingTimeout;
        messageTextInput.addEventListener('input', () => {
            clearTimeout(typingTimeout);
            socket.emit('typing');
            typingTimeout = setTimeout(() => {
            }, 1000);
        });
    }
    
    setupSocketListeners();
}

function sendMessage() {
    const messageInput = document.getElementById('messageText');
    const message = messageInput.value.trim();
    
    if (message && currentUser) {
        socket.emit('chat_message', { message });
        messageInput.value = '';
    }
}

function setupSocketListeners() {
    socket.on('user_list', (users) => {
        document.getElementById('onlineCount').textContent = 
            `${users.length} usuario${users.length !== 1 ? 's' : ''} conectado${users.length !== 1 ? 's' : ''}`;
    });
    
    socket.on('chat_history', (messages) => {
        messages.forEach(msg => displayChatMessage(msg));
    });
    
    socket.on('new_message', (message) => {
        displayChatMessage(message);
    });
    
    socket.on('system_message', (data) => {
        displaySystemMessage(data.message);
    });
    
    socket.on('user_typing', (username) => {
        const indicator = document.getElementById('typingIndicator');
        indicator.querySelector('span').textContent = username;
        indicator.style.display = 'block';
        
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 2000);
    });
}

function displayChatMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    const time = new Date(message.timestamp).toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${message.username}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">
            <p>${escapeHtml(message.message)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displaySystemMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setupChatbot() {
    const toggleChatbot = document.getElementById('toggleChatbot');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const sendChatbot = document.getElementById('sendChatbot');
    const chatbotInput = document.getElementById('chatbotInput');
    
    if (toggleChatbot) {
        toggleChatbot.addEventListener('click', () => {
            chatbotPanel.style.display = 
                chatbotPanel.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    if (sendChatbot) {
        sendChatbot.addEventListener('click', sendChatbotQuery);
        
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatbotQuery();
            }
        });
    }
    
    socket.on('chatbot_response', (data) => {
        displayChatbotResponse(data);
    });
}

function sendChatbotQuery() {
    const input = document.getElementById('chatbotInput');
    const query = input.value.trim();
    
    if (query) {
        displayChatbotQuery(query);
        socket.emit('chatbot_query', query);
        input.value = '';
    }
}

function displayChatbotQuery(query) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const queryDiv = document.createElement('div');
    queryDiv.className = 'user-query';
    queryDiv.textContent = query;
    
    chatbotMessages.appendChild(queryDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function displayChatbotResponse(data) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const responseDiv = document.createElement('div');
    responseDiv.className = 'bot-message';
    
    responseDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="message-content">
            <p>${escapeHtml(data.response)}</p>
            <small class="text-muted">${new Date(data.timestamp).toLocaleTimeString('es-MX')}</small>
        </div>
    `;
    
    chatbotMessages.appendChild(responseDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    console.error(message);
}

window.renderBusinesses = renderBusinesses;
window.businesses = businesses;
