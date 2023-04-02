const express = require('express');
const path = require('path');
const { Download, GetPlaylist, DownloadPlaylist } = require("./API")

const app = express();

app.use(express.static(__dirname + '/src'));
app.use(require('body-parser').json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/index.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.css'))
});

app.get("/icon", (req, res) => {
  res.sendFile(path.join(__dirname, '/src/icon.png'))
})

app.post('/youtube', (req, res) => {
  const url = req.body.url
  if (!url) {
    res.send('No url provided');
    return;
  }
  Download(url, res)
});

app.post('/getPlaylist', (req, res) => {
  const url = req.body.url
  if (!url) {
    res.send('No url provided');
    return;
  }
  GetPlaylist(url, res)
});

app.post('/playlist', (req, res) => {
  const id = req.body.id
  if (!id) {
    res.send('No url provided');
    return;
  }
  DownloadPlaylist(id, res)
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});

