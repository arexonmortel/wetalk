const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const connectDB = require('./db');
const Message = require('./model/message');
const User = require('./model/user');
const cors = require('cors')
const authenticateToken = require('./model/auth');

require('dotenv').config();
const PORT_EXPRESS = process.env.PORT_EXPRESS || 3000;
const PORT_SOCKET = process.env.PORT_SOCKET || 2000;

const app = express();
//Middleware for parsing request body
app.use(express.json())
// Middleware for handling CORS policy
app.use(cors())

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res)=>{
    res.send('Hello from Node JS')
})

// Connect to MongoDB
connectDB();
// User registration with bcrypt pass
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

app.get('/users', async(req, res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error');
    }
})
// user Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).send('Invalid credentials');
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).send('Invalid credentials');
  
      const token = jwt.sign({ username: user.username }, 'SECRET_KEY');
      res.json({ token });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

app.listen(PORT_EXPRESS, ()=>{
    console.log(`Server is running on port ${PORT_EXPRESS}`)
})

// Express server to enable real-time communication between clients and the server.
io.on('connection', (socket) => {
    console.log('A user connected');
});

server.listen(PORT_SOCKET, () => {
    console.log(`Socket.io server is running on port ${PORT_SOCKET}`);
});
