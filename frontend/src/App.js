import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmotionPosts from './components/EmotionPosts';
import PostForm from './components/PostForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<EmotionPosts />} />
          <Route path="/new" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
