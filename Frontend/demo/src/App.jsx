import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import Skills from './Pages/Skills';
import Contact from './Pages/Contact';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Edit from './Pages/Edit';
// import ChatPage from './Pages/ChatPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup"  element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path='/chatpage' element={<ChatPage/>} /> */}
        <Route path="/edit" element={<Edit/>} />
      </Routes>
    </Router>
  );
};

export default App;
