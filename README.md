# Real-time Chat Application

A modern, real-time chat application built with Node.js, Express, Socket.IO, and TypeScript. Features WebSocket connections for instant messaging, room-based chat, and a beautiful responsive UI.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **Room-based Chat**: Join different rooms for private conversations
- **User Management**: Set custom usernames and see online users
- **Modern UI**: Beautiful, responsive design with smooth animations
- **TypeScript Support**: Full TypeScript implementation for better development experience
- **Connection Status**: Real-time connection status indicator
- **Message History**: View recent messages when joining rooms
- **Cross-platform**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Language**: TypeScript
- **Real-time Communication**: WebSocket via Socket.IO
- **Styling**: Modern CSS with gradients and animations

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd chat-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## 🏗️ Project Structure

```
chat-app/
├── src/
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── services/
│   │   └── chatService.ts    # Chat business logic
│   ├── socket/
│   │   └── socketHandler.ts  # Socket.IO event handlers
│   └── server.ts             # Main Express server
├── public/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # CSS styles
│   └── app.js                # Client-side JavaScript
├── dist/                     # Compiled JavaScript (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🎯 Usage

### Getting Started

1. **Set Your Username**: Enter a username in the sidebar and click "Set Username"
2. **Join a Room**: Enter a room name and click "Join Room" (optional)
3. **Start Chatting**: Type your message and press Enter or click "Send"

### Features

- **Real-time Messaging**: Messages appear instantly for all connected users
- **Room Management**: Create or join different chat rooms
- **User List**: See all online users in the current room
- **Connection Status**: Monitor your connection status in real-time
- **Message History**: View recent messages when joining a room

## 🔧 Configuration

### Environment Variables

You can configure the application using environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### CORS Configuration

The application includes CORS configuration for development and production environments. Update the origins in `src/server.ts` for your specific domain.

## 🚀 Deployment

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

You can containerize the application using Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔌 API Endpoints

- `GET /` - Main chat application
- `GET /api/health` - Health check endpoint
- `GET /api/status` - Server status and connected users

## 📡 WebSocket Events

### Client to Server
- `setUsername` - Set user's display name
- `joinRoom` - Join a specific chat room
- `leaveRoom` - Leave current room
- `sendMessage` - Send a chat message

### Server to Client
- `message` - Receive a chat message
- `userJoined` - User joined the room
- `userLeft` - User left the room
- `userList` - List of online users
- `systemMessage` - System notification

## 🎨 Customization

### Styling
The application uses modern CSS with CSS variables. You can customize the appearance by modifying `public/styles.css`.

### Features
Extend the functionality by adding new Socket.IO events in `src/socket/socketHandler.ts` and corresponding client-side handlers in `public/app.js`.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in the environment variables or kill the process using the port
2. **TypeScript compilation errors**: Ensure all dependencies are installed and TypeScript is properly configured
3. **WebSocket connection issues**: Check firewall settings and ensure the server is running

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=socket.io:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Express.js for the web framework
- TypeScript for type safety
- Modern CSS for beautiful styling

---

**Happy Chatting! 💬**
