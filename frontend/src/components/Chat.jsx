import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function Chat() {
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const socket = io('http://localhost:8080');

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5555/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();

    // Listen for incoming messages
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, token]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    socket.emit('message', message);
    setMessages((prevMessages) => [...prevMessages, { text: message, self: true }]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Sidebar */}
      <div className="flex flex-col w-full md:w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <li key={user._id} className="p-2 border-b border-gray-700">
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Chat Area */}
      <div className="flex flex-col w-full md:w-3/4 bg-white">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 p-2 ${msg.self ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${msg.self ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
