const ytdl = require('ytdl-core');
const express = require('express');
const path = require('path');
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.post('/youtube', (req, res) => {
  const url = req.body.url;
  if (!url) {
    res.send('No url provided');
    return;
  }
  try {
    ytdl.getBasicInfo(url).then(async info => {
      const title = info.videoDetails.title;
      res.header('Content-Disposition', 'attachment; filename=' + title + '.mp4');

      await ytdl(url, {
        format: "mp4",
        quality: "highestaudio",
      }).pipe(res);

    }).catch(err => { res.send(err) });
  } catch (error) {
    res.send(error);
  }
});

app.listen(8082, () => {
  console.log('Server started on port 8082');
});
