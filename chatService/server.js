const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const Chat = require('./models/ChatModel'); // Correct the path to your model if necessary

const app = express();
const server = http.createServer(app);


// Middleware
app.use('/api/chat', cors({
    origin: 'http://localhost:3400', // Allow only specific origins
    optionsSuccessStatus: 200, // For legacy browsers
    methods: "GET,POST,PUT,DELETE", // Allowed request methods
    // allowedHeaders: "Content-Type,Authorization" // Allowed headers
}));

const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3400',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Socket.IO Setup for real-time communication
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', ({ room }) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });
    
    socket.on('sendMessage', async (messageData) => {    
        const { room, message, senderId } = messageData;

        // socket.emit('receiveMessage', "Thank you for your message. We will get back to you shortly.");
        // with timeout
        
        setTimeout(() => {
            socket.emit('receiveMessage', "Thank you for your message. We will get back to you shortly.");
        }
        , 500);
    
        // Check if all fields are present
        if (!room || !message || !senderId) {
            console.error('Invalid message data, missing fields');
            return;
        }
    
        // Save message to the database
        const newMessage = new Chat({
            room,
            message,
            senderId
        });
    
        try {
            await newMessage.save();  // Save message to MongoDB
            io.to(room).emit('receiveMessage', message);  // Broadcast message to the room
            console.log('Message saved and emitted:', message);  // Log successful save
        } catch (err) {
            console.error('Failed to save message:', err);  // Log any errors during save
        }
    });
    

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 4906;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
