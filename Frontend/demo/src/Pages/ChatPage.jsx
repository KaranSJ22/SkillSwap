// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import '../styles/ChatPage.css';

// const socket = io('http://localhost:5000'); // Backend server URL

// const ChatPage = ({ match }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [userId, setUserId] = useState(localStorage.getItem('userId'));

//   useEffect(() => {
//     const { userId1, userId2 } = match.params;

//     // Join the room using both user IDs
//     socket.emit('joinRoom', { userId1, userId2 });

//     socket.on('message', (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     return () => {
//       socket.emit('leaveRoom', { userId1, userId2 });
//     };
//   }, [match.params]);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const { userId1, userId2 } = match.params;

//       const newMessage = {
//         sender: userId,
//         recipient: userId1 === userId ? userId2 : userId1,
//         content: message,
//         timestamp: new Date().toISOString(),
//       };

//       socket.emit('sendMessage', newMessage); // Emit message to backend
//       setMessages([...messages, newMessage]);
//       setMessage('');
//     }
//   };

//   return (
//     <div className="chat-page">
//       <h2>Chat</h2>
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index} className={msg.sender === userId ? 'sent' : 'received'}>
//             <p>{msg.content}</p>
//             <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
//           </div>
//         ))}
//       </div>
//       <div className="message-input">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
