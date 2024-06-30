import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmotionPosts.css';

const API_URL = process.env.REACT_APP_API_URL; // 環境変数を使用

const EmotionPosts = ({ emotion }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts/${emotion}`);
                setPosts(response.data);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchPosts();
    }, [emotion]);

    return (
        <div className="posts-container">
            {posts.map(post => (
                <div key={post._id} className="post">
                    <p>{post.content}</p>
                    <p className="timestamp">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default EmotionPosts;
