const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');
const Message = require('./model/message');
const User = require('./model/user');
const authenticateToken = require('./model/auth');

require('dotenv').config();
const PORT_EXPRESS = process.env.PORT_EXPRESS || 3000;
const PORT_SOCKET = process.env.PORT_SOCKET || 2000;

const app = express();

// Middleware for parsing request body and handling CORS
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Node JS');
});

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username is not available');
    }

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid credentials');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, username: user.username }, 'SECRET_KEY');
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get All the users
app.get('/users', async(req, res)=>{
  try {
      const users = await User.find();
      res.json(users);
  } catch (err) {
      res.status(500).send('Server error');
  }
})

// Protected route to get all messages
app.get('/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Express route for serving the client-side React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io setup with authentication
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return next(new Error('Authentication error'));
    socket.user = user;
    next();
  });
}).on('connection', (socket) => {
  console.log('A user connected', socket.user.username);

  // Listen for new messages
  socket.on('new message', async (data) => {
    // Save message to MongoDB
    const message = new Message({
      sender: socket.user.username, 
      message: data.content,
    });
    console.log(message)

    try {
      const savedMessage = await message.save();
      io.emit('new message', savedMessage); 
    } catch (err) {
      console.error(err);
    }
  });

  // Disconnect event
  socket.on('disconnect', (socket) => {
    console.log(`User disconnected`);
  });
});


// Start the server
app.listen(PORT_EXPRESS, () => {
  console.log(`Server is running on port ${PORT_EXPRESS}`);
});

server.listen(PORT_SOCKET, () => {
  console.log(`Socket.io server is running on port ${PORT_SOCKET}`);
});
