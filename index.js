const ytdl = require('ytdl-core');
const fs = require("fs");
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function DownloadY(URL, TITLE, Extension) {
  console.log("Downloading...")
  ytdl(URL, {
    format: Extension
  }).pipe(fs.createWriteStream('./sounds/' + TITLE + '.' + Extension));
  console.log("Fait !")
  console.log(" ")
  AskUrl()
}

async function AskUrl() {
  rl.setPrompt('URL : ')
  rl.prompt();
  await rl.on('line', function (line) {
    AskTitle(line);
  })
}

async function AskTitle(URL) {
  rl.setPrompt('Title : ')
  rl.prompt();
  await rl.on('line', function (line) {
    AskExtenssion(URL, line)
  })
}

async function AskExtenssion(URL, title) {
  rl.setPrompt('Extension : ')
  rl.prompt();
  await rl.on('line', function (line) {
    if (line == "mp3") {
      DownloadY(URL, title, "mp3")
    } else if (line == "mp4") {
      DownloadY(URL, title, "mp4")
    } else if (line == "wav") {
      DownloadY(URL, title, "wav")
    } else {
      console.log("Unrecognized format")
      AskExtenssion(URL, title)
    }
  })
}

AskUrl()