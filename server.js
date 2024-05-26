const express = require('express');
const app = express();
require('dotenv').config();

const server = require('http').createServer(app);
const io = require('socket.io')(server);



const PORT_EXPRESS = process.env.PORT_EXPRESS || 3000;
const PORT_SOCKET = process.env.PORT_SOCKET || 2000;

app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Hello from Node JS')
})

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
