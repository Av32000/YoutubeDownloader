# Youtube Downloader

Youtube Downlaoder is a simple program that allows you to download videos from youtube. The website url is : https://youtubedownloader.av32000.repl.co/

- [index.js](https://github.com/Av32000/YoutubeDownloader/blob/main/index.js) => Local launch allows you to download videos and choose the format
- [webApp.js](https://github.com/Av32000/YoutubeDownloader/blob/main/webapp.js) => File server hosts the website

# Library
 
Use [LTS version](https://nodejs.org/en/download/) of [node.js](https://nodejs.org/en/).

All libraries are included in node_modules

- [ytdl-core](https://www.npmjs.com/package/ytdl-core)
- [express](https://www.npmjs.com/package/express)

# Using index.js

1. Execute the following command =>``node index.js``

2. Enter the url of the video

3. Choose the file name

4. Select an [extension](#supported-extensions-)

5. The video is downloaded in the videos folder

# <a name="extensions"></a>Supported Extensions

- mp4
- webm
- wav
- m4a
- mp3

# Using webapp.js

1. Execute the following command => ``node webapp.js``

2. Open the browser and go to http://localhost:8080/