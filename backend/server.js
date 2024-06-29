const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // CORSミドルウェアをインポート

const app = express();

// CORSミドルウェアを使用
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/emotionPosts', { useNewUrlParser: true, useUnifiedTopology: true });

const PostSchema = new mongoose.Schema({
  content: String,
  emotion: String,
  createdAt: { type: Date, default: Date.now },
  goodCount: { type: Number, default: 0 },
  userId: String // 仮のユーザーIDを追加
});

const Post = mongoose.model('Post', PostSchema);

app.post('/posts', async (req, res) => {
  const userId = req.body.userId || 'defaultUser'; // 仮のユーザーIDを使用
  const lastPost = await Post.findOne({ userId }).sort({ createdAt: -1 });
  const now = new Date();

  if (lastPost && (now - lastPost.createdAt) < 60000) { // 1分以内の投稿を制限
    return res.status(429).send({ error: '連続投稿は1分間隔を空けてください。' });
  }

  const newPost = new Post(req.body);
  newPost.userId = userId; // ユーザーIDを設定
  await newPost.save();
  res.send(newPost);
});

app.get('/posts/:emotion', async (req, res) => {
  const posts = await Post.find({ emotion: req.params.emotion });
  res.send(posts);
});

app.post('/posts/:id/good', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.goodCount = req.body.increment ? post.goodCount + 1 : post.goodCount - 1;
    await post.save();
    res.send(post);
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port', process.env.PORT || 5000);
});
