import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import VideoCall from './VideoCall';
import { FaVideo } from "react-icons/fa6";

const Chat = () => {
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    // Assume the username is decoded from the token
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUsername(decodedToken.username);

    const newSocket = io('http://localhost:8080', {
      auth: {
        token: token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('new message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    socket.emit('new message', { content: message, sender: username });
    setMessage('');
  };

  const handleStartCall = () => {
    setIsCalling(true);
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {isCalling && <VideoCall username={username} />}
      {/* Sidebar */}
      <div className="flex flex-col w-full md:w-1/4 bg-gray-800 text-black p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul className="flex-1 overflow-y-auto">
          {/* Placeholder for users list */}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-full md:w-3/4 bg-white">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 p-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}>
              <div className="inline-block px-4 py-2 rounded-lg">
                <p className='text-sm font-thin text-gray-500'>
                  {msg.sender === username ? 'You' : msg.sender}
                </p>
                <div className={`px-4 py-2 mt-1 rounded-lg ${msg.sender === username ? 'bg-blue-500 text-white' : 'bg-black text-white'}`}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex p-4 border-t border-gray-300">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-md"
            onClick={handleSendMessage}
          >
            Send
          </button>
          <button
            className="ml-2 p-2 bg-green-500 text-white rounded-md"
            onClick={handleStartCall}
          >
            <FaVideo  className='text-2xl'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
