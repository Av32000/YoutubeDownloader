const ytdl = require('ytdl-core');
const express = require('express');
const path = require('path');
const fs = require("fs");

const app = express();

app.use(express.static(__dirname + '/src'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.get("/icon", (req, res) => {
  res.sendFile(path.join(__dirname, '/src/icon.png'))
})

app.post('/youtube', (req, res) => {
  const url = req.body.url
  const format = req.body.format
  if (!url) {
    res.send('No url provided');
    return;
  }
  if (!format) {
    res.send('No format provided');
    return;
  }
  try {
    ytdl.getBasicInfo(url).then(async info => {
      const title = info.videoDetails.title;
      res.attachment(title + "." + format);
      console.log(req.ip + " : " + title + "." + format + " downloaded")
      await ytdl(url, {
        format: format,
        quality: "highestaudio",
      }).pipe(res);

    }).catch(err => { res.send(err) });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/youtubeapp', (req, res) => {
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
      }).pipe(fs.createWriteStream('./videos/' + title + '.mp4'));

      res.send(title)

    }).catch(err => { res.send(err) });
  } catch (error) {
    res.send(error);
  }
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});

