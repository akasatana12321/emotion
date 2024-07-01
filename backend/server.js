const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// CORS設定の追加
const corsOptions = {
  origin: 'https://frontend-ipnzl05io-itokantas-projects.vercel.app', // フロントエンドのURL
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// MongoDBに接続
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/emotionPosts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// スキーマとモデルの定義
const PostSchema = new mongoose.Schema({
  content: String,
  emotion: String,
  createdAt: { type: Date, default: Date.now },
  goodCount: { type: Number, default: 0 },
  userId: String,
});
const Post = mongoose.model('Post', PostSchema);

// ルートの設定
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 他のルートやミドルウェアの設定
app.post('/posts', async (req, res) => {
  const newPost = new Post(req.body);
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
    post.goodCount += req.body.increment ? 1 : -1;
    await post.save();
    res.send(post);
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

// フロントエンドのビルドファイルを提供
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// サーバーの起動
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
