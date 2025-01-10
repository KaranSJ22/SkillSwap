import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to SkillSwap</h1>
      <p>
        A place to connect, share skills, and learn from peers. Build your
        network and grow your expertise together!
      </p>
      <div className="buttons">
      <Link to="/about">Learn More</Link>
      <Link to="/skills">Explore Skills</Link>
      </div>
    </div>
  );
};

export default Home;
