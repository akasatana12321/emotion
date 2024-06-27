import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PostForm.css';

const PostForm = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('Happy');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const maxChars = 120; // 文字数制限
  const maxLines = 3;   // 行数制限

  const handleSubmit = (e) => {
    e.preventDefault();
    const lineCount = content.split('\n').length;
    if (!content.trim()) {
      setError('投稿内容を入力してください。');
    } else if (content.length > maxChars) {
      setError(`投稿は${maxChars}文字以内で入力してください。`);
    } else if (lineCount > maxLines) {
      setError(`投稿は${maxLines}行以内で入力してください。`);
    } else {
      setError('');
      axios.post('http://localhost:5000/posts', { content, emotion })
        .then(response => {
          setContent('');
          setEmotion('Happy');
          alert('投稿が成功しました！');
          onClose();
          navigate('/');
        });
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="post-form">
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="post-textarea" 
          />
          <select 
            value={emotion} 
            onChange={(e) => setEmotion(e.target.value)} 
            className="post-select"
          >
            <option value="Happy">Happy</option>
            <option value="Sad">Sad</option>
            <option value="Angry">Angry</option>
            <option value="Excited">Excited</option>
          </select>
          <button type="submit" className="post-button">投稿</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PostForm;
