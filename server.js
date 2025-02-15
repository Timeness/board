const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const socketIo = require('socket.io');

// SSL Certificates (replace with your actual paths to .pem files)
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Initialize Express app
const app = express();

// Create HTTPS server
const server = https.createServer(credentials, app);

// Initialize Socket.io with HTTPS server
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"]
    }
});

// Static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/viewer.html');
});
app.get('/broadcast', (req, res) => {
    res.sendFile(__dirname + '/public/broadcaster.html');
});

// Socket.io for handling 'selfie' data
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('selfie', (data) => {
        console.log("Received image from broadcaster:", socket.id);
        socket.broadcast.emit('selfie', data);  // Send data to all other connected users
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server on HTTPS
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HTTPS server is running on https://localhost:${PORT}`);
});
