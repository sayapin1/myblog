const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const connect = require("./schemas"); //index.js는 생략됨
connect();

app.use(express.json());
//bodyparser용

app.use("/api", [postsRouter, commentsRouter]);
//내가 api라는 uri로 이것들을 쓰겠다..?

app.get('/', (req,res) => {
  res.send("Don't come in. This is my blog.");
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});