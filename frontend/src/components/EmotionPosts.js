import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostForm from './PostForm';
import './EmotionPosts.css';
import './Modal.css';

const emotions = ['Happy', 'Sad', 'Angry', 'Excited'];

const EmotionPosts = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goodState, setGoodState] = useState({});

  useEffect(() => {
    if (selectedEmotion) {
      axios.get(`http://localhost:5000/posts/${selectedEmotion}`)
        .then(response => {
          setPosts(response.data);
          const initialGoodState = response.data.reduce((acc, post) => {
            acc[post._id] = false;
            return acc;
          }, {});
          setGoodState(initialGoodState);
        })
        .catch(error => {
          console.error("There was an error fetching the data!", error);
        });
    }
  }, [selectedEmotion]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoodClick = (id) => {
    const increment = !goodState[id];
    axios.post(`http://localhost:5000/posts/${id}/good`, { increment })
      .then(response => {
        setPosts(posts.map(post => post._id === id ? response.data : post));
        setGoodState({ ...goodState, [id]: increment });
      })
      .catch(error => {
        console.error("There was an error updating the good count!", error);
      });
  };

  return (
    <div>
      <nav className="emotion-nav">
        <button onClick={openModal}>新しい投稿を作成</button>
        {emotions.map(emotion => (
          <button key={emotion} onClick={() => setSelectedEmotion(emotion)}>{emotion}</button>
        ))}
      </nav>
      {selectedEmotion && (
        <div>
          <h2>{selectedEmotion}</h2>
          {posts.map(post => (
            <div key={post._id} className="post">
              <p>{post.content}</p>
              <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
              <button onClick={() => handleGoodClick(post._id)}>
                グッド {post.goodCount}
              </button>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && <PostForm onClose={closeModal} />}
    </div>
  );
};

export default EmotionPosts;

