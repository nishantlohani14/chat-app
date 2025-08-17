// Chat Application Client
class ChatApp {
    constructor() {
        this.socket = null;
        this.currentUsername = '';
        this.currentRoom = 'General';
        this.isConnected = false;
        
        this.initializeElements();
        this.initializeSocket();
        this.setupEventListeners();
    }

    initializeElements() {
        // Connection status
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusDot = this.connectionStatus.querySelector('.status-dot');
        this.statusText = this.connectionStatus.querySelector('.status-text');

        // User management
        this.usernameInput = document.getElementById('usernameInput');
        this.setUsernameBtn = document.getElementById('setUsernameBtn');
        this.currentUsernameSpan = document.getElementById('currentUsername');

        // Room management
        this.roomInput = document.getElementById('roomInput');
        this.joinRoomBtn = document.getElementById('joinRoomBtn');
        this.leaveRoomBtn = document.getElementById('leaveRoomBtn');
        this.currentRoomSpan = document.getElementById('currentRoom');

        // Chat area
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendMessageBtn = document.getElementById('sendMessageBtn');
        this.charCount = document.getElementById('charCount');

        // Users list
        this.usersList = document.getElementById('usersList');
    }

    initializeSocket() {
        this.socket = io({
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.setupSocketEvents();
    }

    setupSocketEvents() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            this.updateConnectionStatus(true);
            this.enableInputs();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.disableInputs();
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.updateConnectionStatus(false);
            this.showSystemMessage('Connection failed. Trying to reconnect...');
        });

        // Chat events
        this.socket.on('message', (message) => {
            this.displayMessage(message);
        });

        this.socket.on('systemMessage', (message) => {
            this.displaySystemMessage(message);
        });

        this.socket.on('userJoined', (user) => {
            this.addUserToList(user);
            this.showSystemMessage(`${user.username} joined the chat`);
        });

        this.socket.on('userLeft', (userId) => {
            this.removeUserFromList(userId);
        });

        this.socket.on('userList', (users) => {
            this.updateUsersList(users);
        });
    }

    setupEventListeners() {
        // Username management
        this.setUsernameBtn.addEventListener('click', () => {
            this.setUsername();
        });

        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setUsername();
            }
        });

        // Room management
        this.joinRoomBtn.addEventListener('click', () => {
            this.joinRoom();
        });

        this.leaveRoomBtn.addEventListener('click', () => {
            this.leaveRoom();
        });

        this.roomInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.joinRoom();
            }
        });

        // Message sending
        this.sendMessageBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Character count
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
        });
    }

    updateConnectionStatus(connected) {
        if (connected) {
            this.statusDot.classList.add('connected');
            this.statusText.textContent = 'Connected';
        } else {
            this.statusDot.classList.remove('connected');
            this.statusText.textContent = 'Disconnected';
        }
    }

    enableInputs() {
        this.messageInput.disabled = false;
        this.sendMessageBtn.disabled = false;
        this.usernameInput.disabled = false;
        this.setUsernameBtn.disabled = false;
        this.roomInput.disabled = false;
        this.joinRoomBtn.disabled = false;
    }

    disableInputs() {
        this.messageInput.disabled = true;
        this.sendMessageBtn.disabled = true;
        this.usernameInput.disabled = true;
        this.setUsernameBtn.disabled = true;
        this.roomInput.disabled = true;
        this.joinRoomBtn.disabled = true;
    }

    setUsername() {
        const username = this.usernameInput.value.trim();
        if (!username) {
            this.showError('Please enter a username');
            return;
        }

        this.socket.emit('setUsername', username, (success) => {
            if (success) {
                this.currentUsername = username;
                this.currentUsernameSpan.textContent = username;
                this.usernameInput.value = '';
                this.showSuccess('Username updated successfully');
            } else {
                this.showError('Username is already taken or invalid');
            }
        });
    }

    joinRoom() {
        const room = this.roomInput.value.trim();
        if (!room) {
            this.showError('Please enter a room name');
            return;
        }

        this.socket.emit('joinRoom', room, (success) => {
            if (success) {
                this.currentRoom = room;
                this.currentRoomSpan.textContent = room;
                this.roomInput.value = '';
                this.leaveRoomBtn.disabled = false;
                this.showSuccess(`Joined room: ${room}`);
                this.clearMessages();
            } else {
                this.showError('Failed to join room');
            }
        });
    }

    leaveRoom() {
        this.socket.emit('leaveRoom', (success) => {
            if (success) {
                this.currentRoom = 'General';
                this.currentRoomSpan.textContent = 'General';
                this.leaveRoomBtn.disabled = true;
                this.showSuccess('Left the room');
                this.clearMessages();
            } else {
                this.showError('Failed to leave room');
            }
        });
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) {
            return;
        }

        this.socket.emit('sendMessage', message, (success) => {
            if (success) {
                this.messageInput.value = '';
                this.updateCharCount();
            } else {
                this.showError('Failed to send message');
            }
        });
    }

    displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.username === this.currentUsername ? 'own' : 'other'}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-username">${this.escapeHtml(message.username)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.escapeHtml(message.message)}</div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    displaySystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message system';
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showSystemMessage(message) {
        this.displaySystemMessage(message);
    }

    showError(message) {
        this.displaySystemMessage(`❌ ${message}`);
    }

    showSuccess(message) {
        this.displaySystemMessage(`✅ ${message}`);
    }

    updateUsersList(users) {
        this.usersList.innerHTML = '';
        
        if (users.length === 0) {
            this.usersList.innerHTML = '<div class="no-users">No users online</div>';
            return;
        }

        users.forEach(user => {
            this.addUserToList(user);
        });
    }

    addUserToList(user) {
        // Remove existing user if present
        this.removeUserFromList(user.id);

        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.id = `user-${user.id}`;
        userElement.textContent = user.username;
        
        this.usersList.appendChild(userElement);
    }

    removeUserFromList(userId) {
        const userElement = document.getElementById(`user-${userId}`);
        if (userElement) {
            userElement.remove();
        }
    }

    clearMessages() {
        this.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to ${this.currentRoom}!</h2>
                <p>Start chatting with other users in this room.</p>
            </div>
        `;
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/500`;
        
        if (count > 450) {
            this.charCount.style.color = '#e53e3e';
        } else if (count > 400) {
            this.charCount.style.color = '#d69e2e';
        } else {
            this.charCount.style.color = '#999';
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the chat application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
