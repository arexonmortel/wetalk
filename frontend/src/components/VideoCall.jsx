import React, { useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

const VideoCall = ({ username }) => {
  const [myId, setMyId] = useState('');
  const [userId, setUserId] = useState('');
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setMyId(id);
      socket.emit('join', username);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        myVideo.current.srcObject = stream;
        myVideo.current.play();
        call.answer(stream);
        call.on('stream', (userStream) => {
          userVideo.current.srcObject = userStream;
          userVideo.current.play();
        });
      });
    });

    connectionRef.current = peer;

    return () => {
      peer.disconnect();
    };
  }, [username]);

  const callUser = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = connectionRef.current.call(userId, stream);
      myVideo.current.srcObject = stream;
      myVideo.current.play();
      call.on('stream', (userStream) => {
        userVideo.current.srcObject = userStream;
        userVideo.current.play();
      });
    });
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="flex mb-4">
        <video ref={myVideo} className="w-64 h-64 bg-gray-300" />
        <video ref={userVideo} className="w-64 h-64 bg-gray-300 ml-4" />
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="p-2 border border-gray-400 rounded"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={callUser}>
          <i className="fas fa-video"></i> Call User
        </button>
      </div>
      <div className="mt-2">Your ID: {myId}</div>
    </div>
  );
};

export default VideoCall;
