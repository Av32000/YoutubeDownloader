const { Innertube, UniversalCache, Utils } = require('youtubei.js');
const archiver = require('archiver')
const { createWriteStream, mkdirSync, readdir, createReadStream, rm } = require('fs')


async function Download(url, res) {
    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
    const id = url.split("v=")[1]
    let infos = await yt.getBasicInfo(id)
    let stream = await yt.download(id, {
        quality: 'best',
        format: "mp4"
    })

    res.setHeader('Content-Disposition', 'attachment; filename=' + infos.basic_info.title + ".mp4");

    for await (const chunk of Utils.streamToIterable(stream)) {
        res.write(chunk);
    }

    res.end()
}

async function GetPlaylist(url, res) {
    let id = url.split("list=")[1].split("&")[0]
    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
    let playlist = await yt.getPlaylist(id)
    let result = {
        id: id,
        title: playlist.info.title,
        videos: []
    }
    playlist.videos.forEach(video => {
        let element = {
            id: video.id,
            title: video.title.toString(),
            author: video.author.name,
        }
        result.videos.push(element)
    })
    res.send(JSON.stringify(result))
}

async function DownloadPlaylist(playlistId, res) {
    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
    const playlist = await yt.getPlaylist(playlistId);

    const archive = archiver('zip', {
        zlib: { level: 2 }
    });

    res.setHeader('Content-Disposition', `attachment; filename="${playlist.info.title.toString()}.zip"`);
    res.setHeader('Content-Type', 'application/zip');
    archive.pipe(res);
    mkdirSync("./temp/" + playlist.info.title.toString(), { recursive: true })
    let downloading = new Promise((resolve, reject) => {
        playlist.videos.forEach(async video => {
            const videoInfo = await yt.getBasicInfo(video.id);
            const stream = await yt.download(video.id, {
                quality: 'best',
                format: 'mp4'
            });
            let file = createWriteStream("./temp/" + playlist.info.title.toString() + "/" + videoInfo.basic_info.title.replace(/[/\\?%*:|"<>]/g, '-') + ".mp4")
            for await (const chunk of Utils.streamToIterable(stream)) {
                file.write(chunk);
            }

            if (playlist.videos.indexOf(video) == playlist.videos.length - 1) resolve()
        })
    });

    downloading.then(() => {
        const directoryPath = "./temp/" + playlist.info.title.toString()
        readdir(directoryPath, (err, files) => {
            if (err) {
                console.error(err);
                return;
            }

            files.forEach(file => {
                const filePath = `${directoryPath}/${file}`;
                archive.append(createReadStream(filePath), { name: file });
            });

            archive.finalize().then(() => {
                rm(directoryPath, { recursive: true }, () => { res.end() })
            })
        });
    });
}

module.exports = { Download, GetPlaylist, DownloadPlaylist }